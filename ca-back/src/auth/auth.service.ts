import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RadCheckModel } from '../users/entity/radcheck.entity';
import { Chance } from 'chance';
import * as moment from 'moment';
import { UserInfo } from 'src/users/entity/userinfo.entity';
const chance = new Chance();

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(RadCheckModel)
        private radCheckRepository: Repository<RadCheckModel>,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException();
    }

    async login(username: string, password: string) {
        const user = await this.validateUser(username, password);
        return {
            access_token: this.jwtService.sign({ username: user.username, sub: user.id }),
        };
    }

    async register(registrationData: Partial<UserInfo>) {
        const phone = registrationData.mobilephone;

        if (!phone) {
            throw new BadRequestException(`At least one phone number must be provided`);
        }

        const regDate = moment().format('YYYY-MM-DD 00:00:00');

        // Set default values
        registrationData.username = phone;
        registrationData.mobilephone = phone;
        registrationData.creationby = 'administrator';
        registrationData.creationdate = regDate;
        registrationData.updateDate = regDate;

        const password = Math.random().toString(36).slice(-8);

        // Save user info
        const userInfo = await this.usersService.createUserInfo(registrationData);

        // Check if user exists in RadCheck
        let rad = await this.radCheckRepository.findOne({ where: { username: phone } });

        if (!rad) {
            rad = this.radCheckRepository.create({
                username: phone,
                value: password,
                expired: false,
                expiryDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
            });
        } else {
            rad.value = password;
            rad.expired = false;
            rad.expiryDate = new Date(Date.now() + 8 * 60 * 60 * 1000);
        }

        await this.radCheckRepository.save(rad);

        // Return created user info along with rad check data
        return { userInfo, rad };
    }

    async recover(registrationData: Partial<UserInfo>) {
        const phone = registrationData.mobilephone;

        if (!phone) {
            throw new BadRequestException(
                `At least one phone number must be provided`,
            );
        }

        const existing = await this.radCheckRepository.findOne({
            where: {
                username: phone,
            },
        });

        if (!existing) {
            return {
                error: 'not found',
                message: `Could not find a user with phone number ${phone}`,
            };
        }

        const password = chance.word({ length: 6 });
        const current = new Date();
        const expiryDate = new Date(current.getTime() + 60 * 60 * 1000 * 8);

        existing.value = password;
        existing.expired = false;
        existing.expiryDate = expiryDate;

        this.radCheckRepository.save(existing);

        //TODO: Send the token to the user
        // this.notificationService.sendRegistrationPassword(
        //     existing.username,
        //     existing.value,
        //     phone,
        // );
        
        return existing;
    }
}