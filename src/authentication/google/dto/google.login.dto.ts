import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInstance, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { GoogleUserDto } from './google.user.dto';

export class GoogleLoginDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  idToken?: string | null;

  @ApiProperty()
  @IsArray({ each: true })
  @IsOptional()
  scopes?: string[] | null;

  @ValidateNested()
  @IsNotEmpty()
  @IsInstance(GoogleLoginDto)
  user: GoogleUserDto;
}
