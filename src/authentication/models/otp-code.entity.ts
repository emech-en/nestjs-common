import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { generate as generateRandomString } from 'randomstring';

@Entity('otpCode')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class OtpCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 6,
    update: false,
  })
  code: string;

  @Column({ type: 'integer' })
  retryLeft: number;

  @Column({
    type: 'timestamp without time zone',
    update: false,
  })
  expiresAt: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  usedAt?: Date;

  public isExpired() {
    if (this.usedAt != null) {
      return true;
    }
    if (new Date() > this.expiresAt) {
      return false;
    }
    return this.retryLeft < 1;
  }

  public generateCode() {
    if (this.code) {
      return;
    }

    this.code = generateRandomString({
      length: 6,
      charset: 'numeric',
    });
  }
}
