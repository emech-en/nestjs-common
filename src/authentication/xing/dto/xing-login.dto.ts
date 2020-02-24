import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class XingLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  user: any;

  @ApiProperty()
  @IsString()
  hash: string;
}
