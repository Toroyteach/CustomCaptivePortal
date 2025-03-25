import {
  IsDate,
  IsEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AsEither } from '../../config/validate';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

//This is the table for the customers user the service
@Entity({ name: 'userinfo' })
export class UserInfo {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id?: number;

  @Column({ name: 'department', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  department?: string;

  @Column({ name: 'company', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  company?: string;

  @Column({ name: 'workphone', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  workphone?: string;

  @Column({ name: 'homephone', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  homephone?: string;

  @Column({ name: 'mobilephone', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  mobilephone?: string;

  @Column({ name: 'username', nullable: true, length: 128 })
  @MaxLength(128)
  @IsOptional()
  @IsString(AsEither)
  username?: string;

  @Column({ name: 'firstname', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  firstname?: string;

  @Column({ name: 'lastname', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  lastname?: string;

  @Column({ name: 'email', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  email?: string

  @Column({ nullable: true })
  token: string;

  @Column({ name: 'address', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  address?: string;

  @Column({ name: 'city', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  city?: string;

  @Column({ name: 'state', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  state?: string;

  @Column({ name: 'country', nullable: true, length: 100 })
  @MaxLength(100)
  @IsOptional()
  @IsString(AsEither)
  country?: string;

  @Column({ name: 'zip', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  zip?: string;

  @Column({ name: 'notes', nullable: true, length: 200 })
  @MaxLength(200)
  @IsOptional()
  @IsString(AsEither)
  notes?: string;

  @Column({ name: 'changeuserinfo', nullable: true, length: 128 })
  @MaxLength(128)
  @IsOptional()
  @IsString(AsEither)
  changeuserinfo?: string;

  @Column({ name: 'portalloginpassword', nullable: true, length: 128 })
  @MaxLength(128)
  @IsOptional()
  @IsString(AsEither)
  portalLoginPassword?: string;

  @Column({ name: 'enableportallogin', nullable: true, type: 'int' })
  @IsOptional()
  @IsNumber()
  enablePortalLogin?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ name: 'creationdate', nullable: true, type: 'datetime' })
  @IsOptional()
  @IsDate()
  creationdate?: any;

  @Column({ name: 'creationby', nullable: false, length: 128, default: 'administrator' })
  @MaxLength(128)
  @IsOptional()
  @IsString(AsEither)
  creationby?: string;

  @Column({ name: 'updateby', nullable: false, length: 128, default: 'user' })
  @MaxLength(128)
  @IsOptional()
  @IsString(AsEither)
  updateBy?: string;

  @Column({ name: 'updatedate', nullable: true, type: 'datetime' })
  @IsOptional()
  @IsDate()
  updateDate?: any;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}