import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OtpLoginDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  code: string;
}
