import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PasswordRegisterRequestDto {
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  username?: string;
  @ApiProperty()
  @IsString()
  password: string;
}
