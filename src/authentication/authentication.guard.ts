import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { TokenProvider } from './providers';

const logger = new Logger('AuthenticationGuard');

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly tokenProvider: TokenProvider) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;
    logger.verbose(`Token read from request. TOKEN=${token}`);
    if (!token) {
      return true;
    }

    try {
      const account = await this.tokenProvider.verify(token);
      logger.verbose(
        `Account found. ACCOUNT={id: ${account.id}, email: ${account.email}}`,
      );
      if (!account) {
        return false;
      }

      if (account.isBanned) {
        return false;
      }

      (request as any).account = account;
      return true;
    } catch (e) {
      logger.warn(`Error in AuthenticationGuard. MESSAGE=${e.message}`);
      return false;
    }
  }
}
