import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleanupService } from './cleanup.service';
import { UserInfo } from '../users/entity/userinfo.entity';
import { RadCheckModel } from 'src/users/entity/radcheck.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserInfo, RadCheckModel])],
    providers: [CleanupService],
})
export class CleanupModule {}