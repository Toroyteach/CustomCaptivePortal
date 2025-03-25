import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entity/user.entity';
import { UserInfo } from './entity/userinfo.entity';
import { RadCheckModel } from './entity/radcheck.entity';
import { Chance } from 'chance';
import { SmsApiService } from 'src/notification/sms.service';
const chance = new Chance();

@Injectable()
export class UsersService {
    constructor(
        private smsService: SmsApiService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(UserInfo)
        private usersInfoRepository: Repository<UserInfo>,
        @InjectRepository(RadCheckModel)
        private radCheckRepository: Repository<RadCheckModel>,
    ) { }

    async findOne(identifier: string | number): Promise<User | null> {
        return this.usersRepository.findOne({
            where: [
                { username: typeof identifier === "string" ? identifier : undefined },
                { id: typeof identifier === "number" ? identifier : undefined },
            ],
        });
    }

    async findAll(): Promise<Omit<User, "password">[]> {
        const users = await this.usersRepository.find();
        return users.map(({ password, ...user }) => user);
    }

    async deleteAdminUser(id: number): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException("User not found");

        await this.usersRepository.remove(user);
    }

    async update(id: number, password: string): Promise<void> {
        const hash = await bcrypt.hash(password, 10);
        await this.usersRepository.update(id, { password: hash });
    }

    async create(username: string, password: string, role: UserRole): Promise<User> {
        try {
            // Check if the username already exists
            const existingUser = await this.usersRepository.findOne({ where: { username } });
            if (existingUser) {
                throw new ConflictException('Username is already taken');
            }

            // Hash password and create user
            const hash = await bcrypt.hash(password, 10);
            const user = this.usersRepository.create({ username, password: hash, role });

            return await this.usersRepository.save(user);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error; // Re-throw known errors
            }
            throw new InternalServerErrorException('An error occurred while creating the user');
        }
    }

    async setRole(userId: number, role: UserRole): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        user.role = role;
        return this.usersRepository.save(user);
    }

    //This of customers..
    async createUserInfo(userData: Partial<UserInfo>): Promise<UserInfo> {
        const currentDate = new Date();
        const userInfo = this.usersInfoRepository.create({
            ...userData,
            created_at: currentDate,
            updated_at: currentDate,
        });

        const savedUser = await this.usersInfoRepository.save(userInfo);

        // Generate a temporary password
        const password = Math.random().toString(36).slice(-8);

        // Store the credentials in RadCheck
        const radCheck = this.radCheckRepository.create({
            username: savedUser.mobilephone,
            value: password,
            expired: false,
            expiry_date: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8-hour expiry
        });

        await this.radCheckRepository.save(radCheck);

        // Send login credentials via SMS
        const message = `Welcome! Your login details: Username: ${savedUser.mobilephone}, Password: ${password}`;
        await this.smsService.send(savedUser.mobilephone, message);

        return savedUser;
    }

    // Get all customers
    async getAllCustomers(page: number, limit: number): Promise<{ customers: UserInfo[]; total: number; page: number; limit: number }> {
        const [customers, total] = await this.usersInfoRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { created_at: 'DESC' },
        });

        return { customers, total, page, limit };
    }

    // Get a single customer by ID
    async getCustomerById(id: number): Promise<UserInfo | null> {
        return await this.usersInfoRepository.findOne({ where: { id } });
    }

    // Update a customer
    async updateCustomer(id: number, updateData: Partial<UserInfo>): Promise<UserInfo> {
        await this.usersInfoRepository.update(id, updateData);
        return await this.getCustomerById(id);
    }

    //This of customers..
    async deleteCustomer(id: number) {
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