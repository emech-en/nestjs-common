import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from '../dto';
import { FBService } from './fb.service';
import { FbLoginDto } from './fb.login.dto';

@Controller('auth/xing')
@ApiTags('Authentication')
export class FbController {
  constructor(private readonly fbService: FBService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Verify the Xing Login Response And Perform Actual Login' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async verifyXingLogin(@Body() { fbToken }: FbLoginDto): Promise<LoginResponse> {
    return this.fbService.loginByFacebook(fbToken);
  }
}
