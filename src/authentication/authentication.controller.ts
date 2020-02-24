import { Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Token } from './decorators';

@Controller('auth')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from System' })
  @ApiOkResponse({ description: 'User is logged out successfully' })
  async logout(@Token() token: string): Promise<void> {
    await this.authenticationService.logout(token);
  }
}
