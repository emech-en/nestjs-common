import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

const logger = new Logger('AuthenticationGuard');

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;
    logger.verbose(`Token read from request. TOKEN=${token}`);
    if (!token) {
      return true;
    }

    try {
      const account = await this.authenticationService.verifyToken(token);
      if (!account || account.isBanned) {
        return false;
      }
      logger.verbose(`Account found ID=${account.id} EMAIL=${account.email}}`);

      (request as any).account = account;
      (request as any).token = token;
      return true;
    } catch (e) {
      logger.warn(`Error in AuthenticationGuard. MESSAGE=${e.message}`);
      return false;
    }
  }
}
