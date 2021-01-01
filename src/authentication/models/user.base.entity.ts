import { Exclude } from 'class-transformer';
import { Column, Entity, TableInheritance } from 'typeorm';
import { AbstractEntity } from '../../models';

@Entity('user')
@TableInheritance({ column: { name: 'userType', type: 'varchar' } })
export class UserBaseEntity extends AbstractEntity {
  @Column({ unique: true, nullable: true })
  username?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  emailVerified?: Date;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ unique: true, nullable: true })
  facebookId?: string;

  @Column({ unique: true, nullable: true })
  xingId?: string;

  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({ nullable: true })
  shouldChangePassword?: boolean;

  @Column({ default: false })
  isBanned: boolean;

  constructor(data?: Partial<UserBaseEntity>) {
    super();

    if (data) {
      this.username = data.username;
      this.email = data.email;
      this.phone = data.phone;
      this.password = data.password;
      this.shouldChangePassword = data.shouldChangePassword;
      this.facebookId = data.facebookId;
      this.xingId = data.xingId;
      this.googleId = data.googleId;
    }
  }
}
