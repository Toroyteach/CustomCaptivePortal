import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from '../users/entity/userinfo.entity';
import { RadCheckModel } from '../users/entity/radcheck.entity';
// import { MailerService } from '@nestjs-modules/mailer';
import * as moment from 'moment';
import { config } from 'src/config';

@Injectable()
export class CaptivePortalService {
    private readonly logger = new Logger(CaptivePortalService.name);

    constructor(
        @InjectRepository(UserInfo) private userInfoRepo: Repository<UserInfo>,
        @InjectRepository(RadCheckModel) private radCheckRepo: Repository<RadCheckModel>,
        // private mailerService: MailerService
    ) { }

    async requestAccess(visitorData: { mobilephone: string; email: string; username: string; hostEmail: string }) {
        const { mobilephone, email, username, hostEmail } = visitorData;

        // Validate host email
        if (!hostEmail.endsWith(config.captivePortal.companyEmailDomain)) {
            throw new Error('Invalid host email domain');
        }

        // Store visitor details in `userinfo`
        const userInfo = this.userInfoRepo.create({ mobilephone, email, username, hostEmail });
        await this.userInfoRepo.save(userInfo);

        // Generate approval token
        const token = Math.random().toString(36).substring(7);
        const expiration = moment().add(6, 'hours').toISOString();

        // Send approval email to the host
        const approvalLink = `${config.captivePortal.baseUrl}/approve/${token}`;
        const rejectionLink = `${config.captivePortal.baseUrl}/reject/${token}`;

        // await this.mailerService.sendMail({
        //     to: hostEmail,
        //     subject: `Visitor Internet Access Request`,
        //     text: `Visitor ${name} (${email}, ${mobilephone}) is requesting internet access.
        //         Reason: ${reason}
        //         Approve: ${approvalLink}
        //         Reject: ${rejectionLink}
        //         This link expires in 6 hours.`,
        // });

        return { message: 'Request submitted. Awaiting host approval.' };
    }

    async approveAccess(token: string) {
        const request = await this.userInfoRepo.findOne({ where: { token } });

        if (!request) throw new Error('Invalid or expired token');

        // Move user to `radcheck`
        await this.radCheckRepo.save({
            username: request.mobilephone,
            attribute: 'Cleartext-Password',
            op: ':=',
            value: Math.random().toString(36).substring(8),
        });

        // Log approval & delete request
        this.logger.log(`Access granted to ${request.mobilephone}`);
        await this.userInfoRepo.delete(request.id);

        return { message: 'Access granted successfully' };
    }

    async rejectAccess(token: string) {
        const request = await this.userInfoRepo.findOne({ where: { token } });

        if (!request) throw new Error('Invalid or expired token');

        this.logger.log(`Access denied to ${request.mobilephone}`);
        await this.userInfoRepo.delete(request.id);

        return { message: 'Access denied' };
    }
}