import { ChildEntity, Column } from 'typeorm';
import { OtpEntity } from './otp.entity';

@ChildEntity()
export class SmsOtpCodeEntity extends OtpEntity {
  @Column({ type: 'varchar' })
  phone: string;
}
