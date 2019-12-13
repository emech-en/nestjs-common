import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { generate as generateRandomString } from 'randomstring';
import { ApiModelProperty } from '@nestjs/swagger';
import { getEnumValues } from '../../../utilities';

export enum OtpType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

@Entity('otp')
export class OtpEntity {
  @ApiModelProperty({ enum: getEnumValues(OtpType) })
  @Column({ type: 'enum', enum: OtpType, update: false })
  type: OtpType;

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

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

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
