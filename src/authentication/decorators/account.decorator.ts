import {
  createParamDecorator,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountEntity } from '../models';

const logger = new Logger('AccountDecorator');

export const Account = createParamDecorator((data, req) => {
  const account = req.account as AccountEntity;
  if (!account) {
    throw new UnauthorizedException();
  }
  logger.debug(`Current Account: Id=${account.id}, Email=${account.email}`);
  return account;
});
