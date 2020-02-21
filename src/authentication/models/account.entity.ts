import { Column, Entity } from 'typeorm';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { BaseEntity } from '../../models';

@Entity('account')
export class AccountEntity extends BaseEntity {
  @ApiModelPropertyOptional({ minLength: 5, maxLength: 45, uniqueItems: true })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @Column({ unique: true, nullable: true })
  username?: string;

  @ApiModelPropertyOptional({ format: 'email', uniqueItems: true })
  @IsOptional()
  @IsEmail()
  @Column({ unique: true, nullable: true })
  email?: string;

  @ApiModelPropertyOptional({ uniqueItems: true })
  @IsOptional()
  @IsPhoneNumber('ZZ')
  @Column({ unique: true, nullable: true })
  phone?: string;

  @ApiModelPropertyOptional({ readOnly: true })
  @IsEmpty()
  @Column({ nullable: true })
  password?: string;

  @ApiModelPropertyOptional({ readOnly: true })
  @IsEmpty()
  @Column({ nullable: true })
  shouldChangePassword?: boolean;

  @ApiModelPropertyOptional({ readOnly: true })
  @IsEmpty()
  @Column({ default: false })
  isBanned: boolean;
}
