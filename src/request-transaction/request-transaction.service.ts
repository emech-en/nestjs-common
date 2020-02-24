import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager, EntitySchema, ObjectType, Repository } from 'typeorm';
// @ts-ignore
import * as cls from 'node-cls';
import { CONTEXT_NAME, logger } from './request-transaction.helper';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class RequestTransaction {
  constructor(@InjectConnection() private connection: Connection) {}

  getEntityManager(useTransaction?: boolean): EntityManager {
    const clsContext = cls.getContext(CONTEXT_NAME);

    if (useTransaction === false) {
      // IF [useTransaction === false]
      // Return Default Transaction
      logger.verbose(`RequestId: ${clsContext.requestId}: Returning Default EntityManager`);
      return this.connection.manager;
      /////////////////////////////////////////////////////////////////////////////////////////
    } else if (clsContext && clsContext.entityManager) {
      // IF [useTransaction !== false] AND [Transactional EntityManager is found in the Context]
      // return Transactional EntityManager
      logger.verbose(`RequestId: ${clsContext.requestId}: Transactional EntityManager FOUND`);
      return clsContext.entityManager;
      /////////////////////////////////////////////////////////////////////////////////////////
    } else if (useTransaction === true) {
      // IF [useTransaction === true] and [Transactional EntityManager is not found in the Context]
      // Throw Error
      logger.error('Transactional EntityManager NOT_FOUND. Throwing Error.');
      throw new InternalServerErrorException('NOT IN A REQUEST TRANSACTION CONTEXT');
      /////////////////////////////////////////////////////////////////////////////////////////
    } else {
      // IF [useTransaction === undefined] and [Transactional EntityManager is not found in the Context]
      // Return Default Transaction
      logger.warn('Transactional EntityManager NOT_FOUND. Returning Default EntityManager');
      return this.connection.manager;
      /////////////////////////////////////////////////////////////////////////////////////////
    }
  }

  getRepository<T>(target: ObjectType<T> | EntitySchema<T> | string, forceTransaction?: boolean): Repository<T> {
    return this.getEntityManager(forceTransaction).getRepository<T>(target);
  }

  getCustomRepository<T>(customRepo: ObjectType<T>, forceTransaction?: boolean): T {
    return this.getEntityManager(forceTransaction).getCustomRepository<T>(customRepo);
  }
}
