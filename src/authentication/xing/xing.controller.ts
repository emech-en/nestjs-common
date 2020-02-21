import { Body, Controller, Get, Header, Inject, Post } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { XING_LOGIN_HTML } from './xing.helpers';
import { LoginResponse } from '../dto';
import { XingService } from './xing.service';

interface VerifyRequest {
  user: any;
  hash: string;
}

@Controller('auth/xing')
@ApiUseTags('auth/xing')
export class XingController {
  constructor(
    @Inject(XING_LOGIN_HTML)
    private readonly xingLoginHtml: string,
    @Inject(XingService)
    private readonly xingService: XingService,
  ) {}

  @Get('/login')
  @Header('Content-Type', 'text/html; charset=UTF-8')
  getXingLogin(): string {
    return this.xingLoginHtml;
  }

  @Post('/verify')
  async verifyXingLogin(@Body() body: VerifyRequest): Promise<LoginResponse> {
    const { user, hash } = body;
    await this.xingService.validateLogin(user, hash);
    return this.xingService.loginByXing(user);
  }
}
