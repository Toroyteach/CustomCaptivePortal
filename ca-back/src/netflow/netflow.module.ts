import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetflowController } from './netflow.controller';
import { NetflowService } from './netflow.service';
import { UserInfo } from '../users/entity/userinfo.entity';
import { RadCheckModel } from '../users/entity/radcheck.entity';
import { RadPostAuthModel } from './entity/radpostauth.entity';
import { RadAcctModel } from './entity/radacc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo, RadCheckModel, RadPostAuthModel, RadAcctModel])],
  controllers: [NetflowController],
  providers: [NetflowService],
})
export class NetflowModule {}
