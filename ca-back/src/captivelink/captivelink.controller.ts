import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CaptivePortalService } from './captivelink.service';

@Controller('captive-portal')
export class CaptivePortalController {
    constructor(private readonly captivePortalService: CaptivePortalService) { }

    @Post('request-access')
    async requestAccess(@Body() visitorData: { mobilephone: string; email: string; username: string; hostEmail: string }) {
        return this.captivePortalService.requestAccess(visitorData);
    }

    @Get('approve/:token')
    async approveAccess(@Param('token') token: string) {
        // return this.captivePortalService.approveAccess(token);
    }

    @Get('reject/:token')
    async rejectAccess(@Param('token') token: string) {
        // return this.captivePortalService.rejectAccess(token);
    }
}