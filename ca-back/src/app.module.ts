import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entity/user.entity';
import { UserInfo } from './users/entity/userinfo.entity';
import { RadCheckModel } from './users/entity/radcheck.entity';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupModule } from './cleanup/cleanup.module';
import { NetflowModule } from './netflow/netflow.module';
import { MessageLogModel } from './notification/entity/messagelog.entity';
import { RadPostAuthModel } from './netflow/entity/radpostauth.entity';
import { RadAcctModel } from './netflow/entity/radacc.entity';
import { CaptivelinkModule } from './captivelink/captivelink.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CleanupModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, UserInfo, RadCheckModel, MessageLogModel, RadPostAuthModel, RadAcctModel],
        // synchronize: true, // TODO: Disable in production
        // dropSchema: true,// TODO: Remove in production
      }),
    }),
    UserModule,
    AuthModule,
    NotificationModule,
    NetflowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }