import { config } from 'src/config';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageLogModel } from './entity/messagelog.entity';
import * as moment from 'moment';
import * as unirest from 'unirest';

@Injectable()
export class SmsApiService {

    private readonly logger = new Logger(SmsApiService.name);

    headers = {
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        Accept: '*/*',
    };

    constructor(@InjectRepository(MessageLogModel) private messageRepository: Repository<MessageLogModel>) { }

    async send(mobile: string, message) {

        const msg = {
            api_key: config.sms.apiKey,
            service_id: 0,
            mobile: mobile.startsWith('+') ? mobile : `+254${mobile.substring(mobile.length - 9)}`, // format '254...'
            response_type: 'json',
            shortcode: config.sms.senderId,
            message,
        };

        const resp = await this._postRequest(msg);
        this.saveMessageLog(msg, resp[0]);

        return resp;
    }

    async saveMessageLog(msg, resp) {

        const { mobile: msisdn, message: text, shortcode: shortCode } = msg;

        console.log(resp);

        const {
            status_code: statusCode,
            status_desc: statusDesc,
            message_id: messageId,
            mobile_number: mobileNumber,
            network_id: networkId,
            message_cost: messageCost,
            credit_balance: creditBalance,
        } = resp;

        const messageLog: MessageLogModel = {
            msisdn,
            text,
            shortCode,
            statusCode,
            statusDesc,
            messageId,
            mobileNumber,
            networkId,
            messageCost,
            creditBalance,
        };

        this.messageRepository.save(messageLog);

    }

    async getAllMessageLogs(page: number, limit: number): Promise<{ logs: MessageLogModel[]; total: number; page: number; limit: number }> {
        const [logs, total] = await this.messageRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { dateCreated: 'DESC' }, // Sort by latest
        });

        return { logs, total, page, limit };
    }

    async getMessagesByMobile(mobile: string, skip = 0, take = 10) {
        const [data, total] = await this.messageRepository
            .createQueryBuilder('msg')
            .where('msg.msisdn = :mobile', { mobile })
            .orderBy('msg.dateCreated', 'DESC') // Sort by latest
            .skip(skip)
            .take(take)
            .getManyAndCount();

        return {
            data,
            total,
            skip,
            take,
            totalPages: Math.ceil(total / take),
            currentPage: Math.floor(skip / take) + 1,
        };
    }

    async getSMSBalance() {
        const latestBalance = await this.messageRepository
            .createQueryBuilder('message_log')
            .select('message_log.credit_balance', 'credit_balance')
            .orderBy('message_log.id', 'DESC')
            .limit(1)
            .getRawOne();

        return {
            success: true,
            data: { credit_balance: latestBalance?.credit_balance || 0 },
        };
    }

    private async _postRequest(data): Promise<any> {

        return new Promise((resolve, reject) => {
            unirest
                .post(config.sms.apiUrl)
                .headers({
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                })
                .send(data)
                .then((response) => {
                    return resolve(response.body);
                })
                .catch((err) => {
                    this.logger.error('Request Error ', JSON.stringify(err));
                    return reject(err);
                });
        });
    }

}
