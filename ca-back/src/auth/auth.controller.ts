import { Controller, Post, Body, Get, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const { userId, username } = req.user;
    const id = userId;
    return { id, username };
  }

  @Post('recover')
  async recover(@Body() phone: any) {
    return this.authService.recover(phone);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return { message: 'Logout successful' };
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async register(@Body() body: any) {
    return this.authService.register(body);
  }
}