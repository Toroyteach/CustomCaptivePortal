import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RadCheckModel } from './entity/radcheck.entity';
import { UserInfo } from './entity/userinfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RadCheckModel, UserInfo])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export UsersService for AuthModule
})
export class UserModule {}