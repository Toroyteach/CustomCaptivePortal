import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { SmsApiService } from './sms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessageLogModel } from './entity/messagelog.entity';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly smsService: SmsApiService) { }

    @Get('sms-balance')
    @UseGuards(JwtAuthGuard)
    async getSmsBalance() {
        return this.smsService.getSMSBalance();
    }

    // Get all messages sent within a date range (defaults to today)
    // Get all SMS logs
    @Get('message-log')
    @UseGuards(JwtAuthGuard)
    async getMessageLogs(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 50
    ): Promise<{ logs: MessageLogModel[]; total: number; page: number; limit: number }> {
        return this.smsService.getAllMessageLogs(page, limit);
    }

    // Get all messages sent to a specific phone number
    @Get('logs/:mobile')
    @UseGuards(JwtAuthGuard)
    async getMessagesByMobile(
        @Param('mobile') mobile: string,
        @Query('skip') skip = 0,
        @Query('take') take = 10
    ) {
        return this.smsService.getMessagesByMobile(mobile, Number(skip), Number(take));
    }
}