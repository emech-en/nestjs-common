import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  user: any;

  @ApiProperty()
  @IsString()
  hash: string;
}
