import { createParamDecorator, Logger, UnauthorizedException } from '@nestjs/common';
import { UserBaseEntity } from '../models';
import { ObjectType } from 'typeorm';

const logger = new Logger('UserParamDecorator');

export const User = <ConcreteUser extends UserBaseEntity>() =>
  createParamDecorator<ObjectType<ConcreteUser>>((data, req) => {
    if (!req.account) {
      throw new UnauthorizedException();
    }

    if (!(req.account instanceof data)) {
      throw new UnauthorizedException();
    }

    const account = req.account as ConcreteUser;
    if (account.isBanned) {
      throw new UnauthorizedException();
    }

    logger.debug(`Current User: Type=${data.name} Id=${account.id}, Email=${account.email}`);
    return account;
  })();
