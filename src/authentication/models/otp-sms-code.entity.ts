import { ChildEntity, Column } from 'typeorm';
import { OtpCodeEntity } from './otp-code.entity';

@ChildEntity()
export class OtpSmsCodeEntity extends OtpCodeEntity {
  @Column({ type: 'varchar' })
  phone: string;
}
