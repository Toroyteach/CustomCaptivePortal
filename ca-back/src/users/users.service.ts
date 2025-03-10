import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entity/user.entity';
import { UserInfo } from './entity/userinfo.entity';
import { RadCheckModel } from './entity/radcheck.entity';
import { Chance } from 'chance';
const chance = new Chance();

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(UserInfo)
        private usersInfoRepository: Repository<UserInfo>,
        @InjectRepository(RadCheckModel)
        private radCheckRepository: Repository<RadCheckModel>,
    ) { }

    async findOne(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async update(id: number, password: string): Promise<void> {
        const hash = await bcrypt.hash(password, 10);
        await this.usersRepository.update(id, { password: hash });
    }

    async create(username: string, password: string): Promise<User> {
        const hash = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({ username, password: hash });
        return this.usersRepository.save(user);
    }

    //This of customers..
    async createUserInfo(userData: Partial<UserInfo>): Promise<UserInfo> {
        const userInfo = this.usersInfoRepository.create(userData);
        return await this.usersInfoRepository.save(userInfo);
    }

    async setRole(userId: number, role: UserRole): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        user.role = role;
        return this.usersRepository.save(user);
    }

    //This of customers..
    async getAllUserInfo() {
        return this.usersInfoRepository.find();
    }

    //This of customers..
    async deleteUser(id: number) {
        const userData = await this.usersInfoRepository.findOne({ where: { id } });
    
        if (!userData) {
            throw new NotFoundException('User info not found');
        }
    
        const phone = userData.mobilephone;
        if (!phone) {
            throw new BadRequestException('At least one phone number must be provided');
        }
    
        // Find and delete all RadCheck records with the same phone number
        await this.radCheckRepository.delete({ username: phone });
    
        // Find and delete all UserInfo records with the same mobile phone number
        await this.usersInfoRepository.delete({ mobilephone: phone });
    
        return { message: 'All related customer data deleted successfully' };
    }
}