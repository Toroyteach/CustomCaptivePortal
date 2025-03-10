import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleanupService } from './cleanup.service';
import { UserInfo } from '../users/entity/userinfo.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserInfo])],
    providers: [CleanupService],
})
export class CleanupModule {}