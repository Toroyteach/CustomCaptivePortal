import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

//This is the table for the customers user the service
@Entity({ name: 'userinfo' })
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 128 })
  username?: string;

  @Column({ nullable: true, length: 200 })
  mobilephone?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  hostEmail: string;

  @Column({ nullable: true })
  token: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ nullable: false, length: 128, default: 'administrator' })
  creationby: string;
}