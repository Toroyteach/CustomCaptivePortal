import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { SmsApiService } from './sms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly smsService: SmsApiService) { }

    @Get('sms-balance')
    @UseGuards(JwtAuthGuard)
    getSmsBalance(@Query() params) {
        return this.smsService.getSMSBalance();
    }

    @Get('message-log')
    @UseGuards(JwtAuthGuard)
    getMessageLog(@Query() params) {
        return this.smsService.getMessageLog();
    }
}