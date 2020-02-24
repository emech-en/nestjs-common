import { ChildEntity, Column } from 'typeorm';
import { OtpAbstractEntity } from './otp.abstract.entity';

@ChildEntity()
export class OtpSmsEntity extends OtpAbstractEntity {
  @Column({ type: 'varchar' })
  phone: string;
}
