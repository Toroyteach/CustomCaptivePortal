import { Controller, Post, Body, Get, UseGuards, Request, Req, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) { }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const { userId, username } = req.user;
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
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
  async register(@Body() body: any) {
    return this.authService.register(body);
  }
}