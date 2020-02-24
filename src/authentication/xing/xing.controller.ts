import { Body, Controller, Get, Header, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { XING_LOGIN_HTML } from './xing.helpers';
import { LoginResponse } from '../dto';
import { XingService } from './xing.service';
import { VerifyRequestDto } from './dto';

@Controller('auth/xing')
@ApiTags('Authentication')
export class XingController {
  constructor(
    @Inject(XING_LOGIN_HTML)
    private readonly xingLoginHtml: string,
    private readonly xingService: XingService,
  ) {}

  @Get('/login')
  @Header('Content-Type', 'text/html; charset=UTF-8')
  @ApiOperation({ summary: `Login To Xing And and Retrieve Xing User's Info` })
  @ApiOkResponse({
    content: {
      'text/html': {},
    },
  })
  getXingLogin(): string {
    return this.xingLoginHtml;
  }

  @Post('/verify')
  @ApiOperation({ summary: 'Verify the Xing Login Response And Perform Actual Login' })
  @ApiOkResponse({ description: 'User access token', type: LoginResponse })
  async verifyXingLogin(@Body() body: VerifyRequestDto): Promise<LoginResponse> {
    const { user, hash } = body;
    return this.xingService.loginByXing(user, hash);
  }
}
