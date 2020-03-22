import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, ValidateIf } from 'class-validator';

export class PasswordRegisterRequestDto {
  @ApiPropertyOptional()
  @ValidateIf((o) => !o.username)
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => !o.email)
  @MinLength(4)
  @IsString()
  username?: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  password: string;
}
