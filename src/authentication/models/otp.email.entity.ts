import { ChildEntity, Column } from 'typeorm';
import { OtpEntity } from './otp.entity';

@ChildEntity()
export class EmailOtpCodeEntity extends OtpEntity {
  @Column({ type: 'varchar' })
  email: string;
}
