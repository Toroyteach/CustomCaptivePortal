import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { UserInfo } from '../users/entity/userinfo.entity';

@Injectable()
export class CleanupService {
    constructor(@InjectRepository(UserInfo) private userInfoRepository: Repository<UserInfo>) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Runs daily at midnight
    async cleanOldUserInfo() {
        const threeMonthsAgo = moment().subtract(3, 'months').format('YYYY-MM-DD 00:00:00');

        const deleteResult = await this.userInfoRepository.delete({
            creationdate: LessThan(threeMonthsAgo),
        });

        console.log(`Deleted ${deleteResult.affected} old records from UserInfo table`);
    }
}