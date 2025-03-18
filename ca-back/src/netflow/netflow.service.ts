import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Like } from 'typeorm';
import { UserInfo } from '../users/entity/userinfo.entity';
import { RadCheckModel } from '../users/entity/radcheck.entity';
import { RadPostAuthModel } from './entity/radpostauth.entity';
import { RadAcctModel } from './entity/radacc.entity';

@Injectable()
export class NetflowService {
  constructor(
    @InjectRepository(UserInfo) private userInfoRepo: Repository<UserInfo>,
    @InjectRepository(RadCheckModel) private radCheckRepo: Repository<RadCheckModel>,
    @InjectRepository(RadPostAuthModel) private radPostAuthRepo: Repository<RadPostAuthModel>,
    @InjectRepository(RadAcctModel) private radAcctRepo: Repository<RadAcctModel>,
  ) { }

  async getUsers() {
    return this.userInfoRepo.find();
  }

  async getUser(id: number) {
    return this.userInfoRepo.findOne({ where: { id } });
  }

  async getAuthLogs() {
    return this.radPostAuthRepo.find({ order: { authdate: 'DESC' }, take: 100 });
  }

  async getUserAuthLogs(username: string) {
    return this.radPostAuthRepo.find({ where: { username: Like(`%${username}%`) }, order: { authdate: 'DESC' } });
  }

  async getActiveSessions() {
    return this.radAcctRepo.find({ where: { acctstoptime: null } });
  }

  async getUserSessions(username: string) {
    return this.radAcctRepo.find({ where: { username }, order: { acctstarttime: 'DESC' } });
  }

  async getHighUsageUsers() {
    return this.radAcctRepo.find({ where: { acctoutputoctets: MoreThan(1000000000) }, order: { acctoutputoctets: 'DESC' } });
  }

  async getFrequentFailures() {
    return this.radPostAuthRepo
      .createQueryBuilder('radpostauth')
      .select('radpostauth.username', 'username')
      .addSelect('COUNT(*)', 'attempts')
      .where('radpostauth.reply = :reply', { reply: 'Access-Reject' })
      .groupBy('radpostauth.username')
      .having('COUNT(*) > 5')
      .orderBy('MAX(radpostauth.authdate)', 'DESC')
      .getRawMany();
  }
}