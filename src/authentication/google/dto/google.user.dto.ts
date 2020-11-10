import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  photo?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  familyName?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  givenName?: string | null;
}
