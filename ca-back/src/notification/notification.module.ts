import { Module } from '@nestjs/common';
import { NotificationsController } from './notification.controller';
import { SmsApiService } from './sms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageLogModel } from './entity/messagelog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageLogModel])],
  controllers: [NotificationsController],
  providers: [SmsApiService],
  exports: [SmsApiService]
})
export class NotificationModule {}
