import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { SmsApiService } from './sms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly smsService: SmsApiService) { }

    @Get('sms-balance')
    @UseGuards(JwtAuthGuard)
    async getSmsBalance(@Query() params) {
        return this.smsService.getSMSBalance();
    }

    // Get all messages sent within a date range (defaults to today)
    @Get('message-log')
    @UseGuards(JwtAuthGuard)
    async getMessageLogs(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('skip') skip?: number,
        @Query('take') take?: number
    ) {
        return this.smsService.getMessageLog(startDate, endDate, skip, take);
    }

    // Get all messages sent to a specific phone number
    @Get('logs/:mobile')
    @UseGuards(JwtAuthGuard)
    async getMessagesByMobile(@Param('mobile') mobile: string) {
        return this.smsService.getMessageLog().then((logs) =>
            logs.filter((log) => log.msg_msisdn === mobile)
        );
    }
}