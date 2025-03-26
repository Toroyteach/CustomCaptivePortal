import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RadCheckModel } from '../users/entity/radcheck.entity';
import { Chance } from 'chance';
import * as moment from 'moment';
import { UserInfo } from 'src/users/entity/userinfo.entity';
import { SmsApiService } from 'src/notification/sms.service';
const chance = new Chance();

@Injectable()
export class AuthService {
    constructor(
        private smsService: SmsApiService,
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(RadCheckModel)
        private radCheckRepository: Repository<RadCheckModel>,
        @InjectRepository(UserInfo)
        private userInfoRepository: Repository<UserInfo>
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException("Invalid username or password");
    }

    async login(username: string, password: string) {
        const user = await this.validateUser(username, password);
        return {
            access_token: this.jwtService.sign({ username: user.username, sub: user.id }),
            user: {
                id: user.id,
                username: user.username,
                email: user.email, // Include other necessary fields
                role: user.role,
            }
        };
    }

    async register(registrationData: Partial<UserInfo>) {
        const phone = registrationData.mobilephone;

        if (!phone) {
            throw new BadRequestException(`At least one phone number must be provided`);
        }

        const regDate = new Date();

        registrationData.mobilephone = phone;
        registrationData.creationby = 'administrator';
        registrationData.creationdate = regDate;
        registrationData.updateDate = regDate;

        try {
            await this.userInfoRepository.save(registrationData);

            const existing = await this.radCheckRepository.findOne({ where: { username: phone } });
            const password = Math.random().toString(36).slice(-8);
            const expiryDate = new Date(Date.now() + 8 * 60 * 60 * 1000);

            let rad: RadCheckModel;
            if (existing) {
                existing.value = password;
                existing.expired = false;
                existing.expiry_date = expiryDate;
                rad = existing;
            } else {
                rad = this.radCheckRepository.create({
                    username: phone,
                    value: password,
                    op: ':=',
                    attribute: 'Cleartext-Password',
                    expired: false,
                    expiry_date: expiryDate,
                });
            }

            await this.radCheckRepository.save(rad);

            const message = `Your registration is successful. Your login password is: ${password}`;
            await this.smsService.send(phone, message);

            return { success: true, message: "Registration successful!", username: phone };
        } catch (error) {
            throw new InternalServerErrorException("Registration failed. Please try again.");
        }
    }

    async recover(registrationData: Partial<UserInfo>) {
        const phone = registrationData.mobilephone;

        if (!phone) {
            throw new BadRequestException(`At least one phone number must be provided`);
        }

        const existing = await this.radCheckRepository.findOne({ where: { username: phone } });

        if (!existing) {
            throw new NotFoundException(`Could not find a user with phone number ${phone}`);
        }

        try {
            const password = chance.word({ length: 6 });
            const expiryDate = new Date(Date.now() + 8 * 60 * 60 * 1000);

            existing.value = password;
            existing.expired = false;
            existing.expiry_date = expiryDate;

            await this.radCheckRepository.save(existing);
            const message = `Network Login Details: Username: ${existing.username}, Password: ${password}`;
            await this.smsService.send(phone, message);

            return { success: true, message: "Recovery successful! Check SMS for details." };
        } catch (error) {
            throw new InternalServerErrorException("Recovery failed. Please try again.");
        }
    }
}