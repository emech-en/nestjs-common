import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager, EntitySchema, ObjectType, Repository } from 'typeorm';
// @ts-ignore
import * as cls from 'node-cls';
import { CONTEXT_NAME, logger } from './request-transaction.helper';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class RequestTransactionProvider {
  constructor(@InjectConnection() private connection: Connection) {}

  getEntityManager(forceTransaction: boolean = true): EntityManager {
    const clsContext = cls.getContext(CONTEXT_NAME);
    if (clsContext && clsContext.entityManager) {
      logger.verbose(`RequestId: ${clsContext.requestId}: Transactional EntityManager FOUND`);
      return clsContext.entityManager;
    } else if (!forceTransaction) {
      logger.error('Transactional EntityManager NOT_FOUND. Throwing Error.');
      throw new InternalServerErrorException('NOT IN A REQUEST TRANSACTION CONTEXT');
    } else {
      logger.warn('Transactional EntityManager NOT_FOUND. Returning Default EntityManager');
      return this.connection.manager;
    }
  }

  getRepository<T>(target: ObjectType<T> | EntitySchema<T> | string, forceTransaction: boolean = true): Repository<T> {
    return this.getEntityManager(forceTransaction).getRepository(target);
  }

  getCustomRepository<T>(customRepo: ObjectType<T>, forceTransaction: boolean = true): T {
    return this.getEntityManager(forceTransaction).getCustomRepository(customRepo);
  }
}
