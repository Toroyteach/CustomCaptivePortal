import { Controller, Get, Post, Put, Delete, UseGuards, Request, Patch, Body, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserRole } from './entity/user.entity';
import { UserInfo } from './entity/userinfo.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req) {
        return this.usersService.findAll();
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async getUserById(@Param("id", ParseIntPipe) id: number): Promise<Omit<User, "password">> {
        const user = await this.usersService.findOne(id);
        if (!user) throw new NotFoundException("User not found");
        const { password, ...userData } = user;
        return userData;
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    async deleteAdminUser(@Param("id", ParseIntPipe) id: number): Promise<{ message: string }> {
        await this.usersService.deleteAdminUser(id);
        return { message: "User deleted successfully" };
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: number, @Body() body: { password: string }) {
        return this.usersService.update(id, body.password);
    }

    @Post()
    // @UseGuards(JwtAuthGuard)
    async create(@Body() body: { username: string; password: string; role: UserRole }) {
        return this.usersService.create(body.username, body.password, body.role);
    }

    @Post(':id/set-role')
    @UseGuards(JwtAuthGuard)
    async setRole(@Param('id', ParseIntPipe) id: number, @Body('role') role: UserRole) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return this.usersService.setRole(id, role);
    }


    // Create a new customer
    @Post('customers')
    @UseGuards(JwtAuthGuard)
    async createCustomer(@Body() userData: Partial<UserInfo>): Promise<UserInfo> {
        return this.usersService.createUserInfo(userData);
    }

    // Get all customers
    @Get('customers/getAll')
    @UseGuards(JwtAuthGuard)
    async getCustomers(): Promise<UserInfo[]> {
        return this.usersService.getAllCustomers();
    }

    // Get a single customer by ID
    @Get('customers/:id')
    @UseGuards(JwtAuthGuard)
    async getCustomer(@Param('id', ParseIntPipe) id: number): Promise<UserInfo | null> {
        const customer = await this.usersService.getCustomerById(id);
        if (!customer) throw new NotFoundException('Customer not found');
        return customer;
    }

    // Update a customer
    @Put('customers/:id')
    @UseGuards(JwtAuthGuard)
    async updateCustomer(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: Partial<UserInfo>,
    ): Promise<UserInfo> {
        return this.usersService.updateCustomer(id, updateData);
    }

    // Delete a customer
    @Delete('customers/:id')
    @UseGuards(JwtAuthGuard)
    async deleteCustomer(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        await this.usersService.deleteCustomer(id);
        return { message: 'Customer deleted successfully' };
    }
}