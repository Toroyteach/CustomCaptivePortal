import { Controller, Get, Param } from '@nestjs/common';
import { NetflowService } from './netflow.service';

@Controller('radius')
export class NetflowController {
  constructor(private readonly netflowService: NetflowService) {}

  @Get('users')
  getUsers() {
    return this.netflowService.getUsers();
  }

  @Get('users/:id')
  getUser(@Param('id') id: number) {
    return this.netflowService.getUser(id);
  }

  @Get('auth-logs')
  getAuthLogs() {
    return this.netflowService.getAuthLogs();
  }

  @Get('auth-logs/:username')
  getUserAuthLogs(@Param('username') username: string) {
    return this.netflowService.getUserAuthLogs(username);
  }

  @Get('active-sessions')
  getActiveSessions() {
    return this.netflowService.getActiveSessions();
  }

  @Get('user-sessions/:username')
  getUserSessions(@Param('username') username: string) {
    return this.netflowService.getUserSessions(username);
  }

  @Get('high-usage')
  getHighUsageUsers() {
    return this.netflowService.getHighUsageUsers();
  }

  @Get('frequent-failures')
  getFrequentFailures() {
    return this.netflowService.getFrequentFailures();
  }
}