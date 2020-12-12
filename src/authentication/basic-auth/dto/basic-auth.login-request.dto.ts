import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, ValidateIf } from 'class-validator';

export class BasicAuthRequestDto {
  @ApiPropertyOptional()
  @ValidateIf((o) => !o.email)
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => !o.username)
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  password: string;
}
