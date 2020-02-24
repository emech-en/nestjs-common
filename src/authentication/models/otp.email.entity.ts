import { ChildEntity, Column } from 'typeorm';
import { OtpAbstractEntity } from './otp.abstract.entity';

@ChildEntity()
export class OtpEmailEntity extends OtpAbstractEntity {
  @Column({ type: 'varchar' })
  email: string;
}
