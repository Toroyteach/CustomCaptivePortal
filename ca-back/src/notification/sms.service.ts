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

        console.log('Message sent to customer is as below...');
        console.log({ message });

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

    async getMessageLog(startDate?, endDate?, skip = 0, take = 100) {

        const startDateFilter = startDate ? new Date(startDate) : new Date();

        const endDateFilter = endDate ? new Date(endDate) : new Date();

        const start = moment(startDateFilter).format('YYYY-MM-DD 00:00:00');

        const end = moment(endDateFilter)
            .add(1, 'day')
            .format('YYYY-MM-DD 00:00:00');

        return this.messageRepository
            .createQueryBuilder('msg')
            .where('date_created >= :start and date_created <= :end', { start, end })
            .skip(skip)
            .take(take)
            .getRawMany();
    }

    getSMSBalance(asPerDate?) {

        const start = moment(asPerDate ? new Date(asPerDate) : new Date()).format('YYYY-MM-DD 00:00:00',);

        const end = moment(asPerDate ? new Date(asPerDate) : new Date()).add(1, 'day').format('YYYY-MM-DD 00:00:00');

        return this.messageRepository
            .createQueryBuilder('message_log')
            .select('credit_balance as balance')
            .where('date_created >= :start and date_created <= :end', { start, end })
            .orderBy('date_created', 'DESC')
            .limit(1)
            .getRawOne();
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
