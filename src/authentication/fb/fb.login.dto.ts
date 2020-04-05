import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FbLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fbToken: string;
}
