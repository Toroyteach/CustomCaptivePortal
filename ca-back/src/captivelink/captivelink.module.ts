import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RadCheckModel } from 'src/users/entity/radcheck.entity';
import { UserInfo } from 'src/users/entity/userinfo.entity';
import { CaptivePortalController } from './captivelink.controller';
import { CaptivePortalService } from './captivelink.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RadCheckModel, UserInfo])
    ],
    providers: [CaptivePortalService],
    controllers: [CaptivePortalController],
})
export class CaptivelinkModule {}
