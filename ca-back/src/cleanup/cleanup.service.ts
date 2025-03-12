import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { UserInfo } from '../users/entity/userinfo.entity';
import { RadCheckModel } from 'src/users/entity/radcheck.entity';

@Injectable()
export class CleanupService {
    constructor(@InjectRepository(UserInfo) private userInfoRepository: Repository<UserInfo>,
        @InjectRepository(RadCheckModel) private radCheckRepository: Repository<RadCheckModel>) { }

    //Runs daily to delete users older than 3 months
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Runs daily at midnight
    async cleanOldUserInfo() {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const deleteResult = await this.userInfoRepository.delete({
            created_at: LessThan(threeMonthsAgo),
        });
    }

    //Runs every minute to disable expired users
    @Cron(CronExpression.EVERY_MINUTE)
    async disableExpiredUsers() {

        const current = new Date();
        const expiryDate = new Date(current.getTime() - 8 * 60 * 60 * 1000); // 8 hours ago

        // Get all users whose expiry date is past and are not marked as expired
        const expiredUsers = await this.radCheckRepository.find({
            where: { expired: false, expiryDate: LessThan(expiryDate) }
        });

        if (expiredUsers.length === 0) {
            return;
        }

        // Update expired users
        const updatedUsers = expiredUsers.map(user => ({
            ...user,
            password: this.generateRandomPassword(), // Assign new password
            expired: true, // Mark as expired
        }));

        await this.radCheckRepository.save(updatedUsers);
    }

    // Generate a random password
    private generateRandomPassword(): string {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }
}