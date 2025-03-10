import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        return this.authService.login(body.username, body.password);
    }

    @Post('recover')
    async recover(@Body() phone: any) {
      console.log({ controller: true, phone });
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