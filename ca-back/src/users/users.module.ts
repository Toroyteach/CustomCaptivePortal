import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RadCheckModel } from './entity/radcheck.entity';
import { UserInfo } from './entity/userinfo.entity';
import { SmsApiService } from 'src/notification/sms.service';
import { MessageLogModel } from 'src/notification/entity/messagelog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RadCheckModel, UserInfo, MessageLogModel])],
  providers: [UsersService, SmsApiService],
  controllers: [UsersController],
  exports: [UsersService], // Export UsersService for AuthModule
})
export class UserModule {}