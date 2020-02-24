import { Global, Module } from '@nestjs/common';
import { RequestTransaction } from './request-transaction.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestTransactionInterceptor } from './request-transaction.interceptor';

@Global()
@Module({
  providers: [
    RequestTransaction,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestTransactionInterceptor,
    },
  ],
  exports: [RequestTransaction],
})
export class RequestTransactionModule {}
