import { Controller, Get, Post, Delete, UseGuards, Request, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from './entity/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req) {
        return this.usersService.findAll();
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: number, @Body() body: { password: string }) {
        return this.usersService.update(id, body.password);
    }

    @Post('register')
    @UseGuards(JwtAuthGuard)
    async create(@Body() body: { username: string; password: string }) {
        return this.usersService.create(body.username, body.password);
    }

    @Post(':id/set-role')
    @UseGuards(JwtAuthGuard)
    setRole(@Param('id', ParseIntPipe) id: number, @Body('role') role: UserRole) {
        return this.usersService.setRole(id, role);
    }

    @Get('customers-info')
    @UseGuards(JwtAuthGuard)
    async getAllUserInfo() {
        return this.usersService.getAllUserInfo();
    }

    @UseGuards(JwtAuthGuard)
    @Delete('customers-info/:id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deleteUser(id);
    }
}