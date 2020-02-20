import { Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Token } from './decorators';

@Controller('auth')
@ApiUseTags('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('logout')
  @ApiOperation({ title: 'Logout from System' })
  @ApiOkResponse({ description: 'User is logged out successfully' })
  async login(@Token() token: string): Promise<void> {
    await this.authenticationService.logout(token);
  }
}
