import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('radacct')
export class RadAcctModel {
  @PrimaryGeneratedColumn()
  radacctid: number; // Primary key

  @Column({ type: 'varchar', length: 64 })
  username: string; // User identifier

  @Column({ type: 'varchar', length: 64, nullable: true })
  nasipaddress: string; // IP of the NAS device

  @Column({ type: 'varchar', length: 32, nullable: true })
  acctsessionid: string; // Session ID

  @Column({ type: 'varchar', length: 32, nullable: true })
  acctuniqueid: string; // Unique session ID

  @Column({ type: 'datetime', nullable: true })
  acctstarttime: Date; // Start time of session

  @Column({ type: 'datetime', nullable: true })
  acctstoptime: Date; // End time of session

  @Column({ type: 'int', nullable: true })
  acctsessiontime: number; // Total session duration in seconds

  @Column({ type: 'bigint', nullable: true })
  acctinputoctets: number; // Data received (bytes)

  @Column({ type: 'bigint', nullable: true })
  acctoutputoctets: number; // Data sent (bytes)

  @Column({ type: 'varchar', length: 64, nullable: true })
  calledstationid: string; // MAC or identifier of access point

  @Column({ type: 'varchar', length: 64, nullable: true })
  callingstationid: string; // User’s device MAC or identifier

  @Column({ type: 'varchar', length: 50, nullable: true })
  acctterminatecause: string; // Reason for session termination

  @Column({ type: 'varchar', length: 32, nullable: true })
  servicetype: string; // Type of service (e.g., Login, Framed-User)

  @Column({ type: 'varchar', length: 32, nullable: true })
  framedprotocol: string; // Protocol used (e.g., PPP, Ethernet)
}