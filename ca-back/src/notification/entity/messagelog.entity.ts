import { IsDate, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'message_log' })
export class MessageLogModel {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id?: number;

  @Column({ name: 'message_text', nullable: false })
  @IsString()
  text: string;

  @Column({ name: 'msisdn', nullable: false })
  @IsString()
  msisdn: string;

  @Column({ name: 'short_code', nullable: false })
  @IsString()
  shortCode: string;

  @CreateDateColumn({ name: 'date_created', type: 'timestamp' })
  @IsDate()
  dateCreated?: Date;

  @UpdateDateColumn({ name: 'last_updated', type: 'timestamp' })
  @IsDate()
  lastUpdated?: Date;

  @Column({ name: 'status_code', nullable: true })
  @IsString()
  statusCode?: string;

  @Column({ name: 'status_desc', nullable: true })
  @IsString()
  statusDesc?: string;

  @Column({ name: 'message_id', nullable: true })
  @IsString()
  messageId?: string;

  @Column({ name: 'mobile_number', nullable: true })
  @IsString()
  mobileNumber?: string;

  @Column({ name: 'network_id', nullable: true })
  @IsString()
  networkId?: string;

  @Column({ name: 'message_cost', nullable: true })
  @IsString()
  messageCost?: string;

  @Column({ name: 'credit_balance', nullable: true })
  @IsString()
  creditBalance?: string;
}
