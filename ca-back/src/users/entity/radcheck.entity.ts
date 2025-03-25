import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

//This is the free radius table
@Entity({ name: 'radcheck' })
export class RadCheckModel {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true, length: 64 })
  username: string;

  @Column({ length: 64 })
  attribute: string = 'Cleartext-Password';

  @Column({ length: 2 })
  op: string = ':=';

  @Column({ length: 253 })
  value: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expiry_date: Date;

  @Column({ type: 'tinyint', default: false })
  expired: boolean;
}