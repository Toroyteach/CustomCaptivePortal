import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('radpostauth')
export class RadPostAuthModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  username: string;

  @Column({ type: 'varchar', length: 16 })
  reply: string; // "Access-Accept" or "Access-Reject"

  @Column({ type: 'varchar', length: 50, nullable: true })
  authdate: Date; // Timestamp of authentication

  
}