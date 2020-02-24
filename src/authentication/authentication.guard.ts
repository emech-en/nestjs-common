import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

const logger = new Logger('AuthenticationGuard');

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Authorization: Bearer <token>
    const token = request.headers.authorization?.substr(7);
    logger.verbose(`Token read from request. TOKEN=${token}`);
    if (!token) {
      return true;
    }

    try {
      const user = await this.authenticationService.verifyToken(token);
      if (!user || user.isBanned) {
        return false;
      }
      logger.verbose(`Account found ID=${user.id} EMAIL=${user.email}}`);

      request.currentUser = user;
      request.token = token;
      return true;
    } catch (e) {
      logger.warn(`Error in AuthenticationGuard. MESSAGE=${e.message}`);
      return false;
    }
  }
}
