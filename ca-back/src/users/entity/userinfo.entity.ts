import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

//This is the table for the customers user the service
@Entity({ name: 'userinfo' })
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 128 })
  username?: string;

  @Column({ nullable: true, length: 200 })
  mobilephone?: string;

  @Column({ type: 'datetime', nullable: true })
  updateDate?: string;

  @Column({ type: 'datetime', nullable: true })
  creationdate?: string;

  @Column({ nullable: false, length: 128, default: 'administrator' })
  creationby: string;
}