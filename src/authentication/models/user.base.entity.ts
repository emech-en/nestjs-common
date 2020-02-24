import { Column, Entity, TableInheritance } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { AbstractEntity } from '../../models';

@Entity('user')
@TableInheritance({ column: { name: 'userType', type: 'varchar' } })
export class UserBaseEntity extends AbstractEntity {
  @ApiPropertyOptional({ minLength: 5, maxLength: 45, uniqueItems: true })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @Column({ unique: true, nullable: true })
  username?: string;

  @ApiPropertyOptional({ format: 'email', uniqueItems: true })
  @IsOptional()
  @IsEmail()
  @Column({ unique: true, nullable: true })
  email?: string;

  @ApiPropertyOptional({ uniqueItems: true })
  @IsOptional()
  @IsPhoneNumber('ZZ')
  @Column({ unique: true, nullable: true })
  phone?: string;

  @ApiPropertyOptional({ readOnly: true })
  @IsEmpty()
  @Column({ nullable: true })
  password?: string;

  @ApiPropertyOptional({ readOnly: true })
  @IsEmpty()
  @Column({ nullable: true })
  shouldChangePassword?: boolean;

  @ApiPropertyOptional({ readOnly: true })
  @IsEmpty()
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
    }
  }
}
