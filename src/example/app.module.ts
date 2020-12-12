import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestTransactionModule } from '../request-transaction';
import { AppController } from './app.controller';
import { AppInfoProvider } from './app.info';
import { AuthModule } from './boot/auth.module';
import * as typeOrmOptions from './typeorm.config';

const controllers: any[] = [AppController];

@Module({
  imports: [HttpModule, TypeOrmModule.forRoot(typeOrmOptions), RequestTransactionModule, AuthModule],
  controllers,
  providers: [AppInfoProvider],
})
export class AppModule {}
