import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from '../dto';
import { FBService } from './fb.service';
import { FbLoginDto } from './dto';

@Controller('auth/fb')
@ApiTags('Authentication')
export class FbController {
  constructor(private readonly fbService: FBService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Verify Provided Facebook AccessToken and Perform Login/Register Operation' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async loginByFacebookToken(@Body() { fbToken }: FbLoginDto): Promise<LoginResponse> {
    return this.fbService.loginByFacebook(fbToken);
  }
}
