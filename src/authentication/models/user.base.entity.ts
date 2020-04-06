import { Column, Entity, TableInheritance } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractEntity } from '../../models';
import { Exclude } from 'class-transformer';

@Entity('user')
@TableInheritance({ column: { name: 'userType', type: 'varchar' } })
export class UserBaseEntity extends AbstractEntity {
  @ApiPropertyOptional({ uniqueItems: true, readOnly: true })
  @Column({ unique: true, nullable: true })
  username?: string;

  @ApiPropertyOptional({ format: 'email', uniqueItems: true, readOnly: true })
  @Column({ unique: true, nullable: true })
  email?: string;

  @ApiPropertyOptional({ uniqueItems: true, readOnly: true })
  @Column({ unique: true, nullable: true })
  phone?: string;

  @ApiPropertyOptional({ uniqueItems: true, readOnly: true })
  @Column({ unique: true, nullable: true })
  facebookId?: string;

  @ApiPropertyOptional({ uniqueItems: true, readOnly: true })
  @Column({ unique: true, nullable: true })
  xingId?: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @ApiPropertyOptional({ readOnly: true })
  @Column({ nullable: true })
  @Exclude({})
  shouldChangePassword?: boolean;

  @ApiProperty({ readOnly: true })
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
    }
  }
}
