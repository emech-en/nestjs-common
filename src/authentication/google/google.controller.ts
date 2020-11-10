import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from '../dto';
import { GoogleService } from './google.service';
import { GoogleLoginDto } from './dto';

@Controller('auth/google')
@ApiTags('Authentication')
export class GoogleContorller {
  constructor(private readonly googleService: GoogleService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Verify Provided Google LoginInfo and Perform Login/Register Operation' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async loginByGoogle(@Body()  loginDto: GoogleLoginDto): Promise<LoginResponse> {
    return this.googleService.loginByGoogle(loginDto);
  }
}
