import { ChildEntity, Column } from 'typeorm';
import { OtpCodeEntity } from './otp-code.entity';

@ChildEntity()
export class OtpEmailCodeEntity extends OtpCodeEntity {
  @Column({ type: 'varchar' })
  email: string;
}
