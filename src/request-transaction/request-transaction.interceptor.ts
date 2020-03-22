import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
// @ts-ignore
import * as cls from 'node-cls';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CONTEXT_NAME, logger } from './request-transaction.helper';

@Injectable()
export class RequestTransactionInterceptor implements NestInterceptor {
  constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = Math.floor(Math.random() * 100000 + 1000000);
    const clsContext = cls.create(CONTEXT_NAME);

    return clsContext.run(async () => {
      clsContext.requestId = requestId;
      logger.verbose(`RequestId=${requestId}: Context CREATED`);

      try {
        const result = await this.entityManager.transaction(async (entityManager) => {
          logger.verbose(`RequestId=${requestId}: Transaction STARTED`);
          clsContext.entityManager = entityManager;
          return await next.handle().toPromise();
        });
        logger.verbose(`RequestId=${requestId}: Transaction SUCCEEDED`);
        return result;
      } catch (reason) {
        logger.error(`RequestId=${requestId}: Transaction FAILED`);
        throw reason;
      }
    });
  }
}
