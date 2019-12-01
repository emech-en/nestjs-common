import { DynamicModule, Provider, Type } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AccessTokenEntity,
  AccountEntity,
  OtpCodeEntity,
  OtpEmailCodeEntity,
  OtpSmsCodeEntity,
} from './models';
import { AuthenticationController } from './authentication.controller';
import {
  BcryptHashProvider,
  HashProvider,
  LoginProvider,
  OtpEmailLoginProvider,
  PasswordLoginProvider,
  setLoginProviders,
  SimpleTokenProvider,
  TokenProvider,
} from './providers';
import { AuthenticationModule } from './authentication.module';
import { ClassProvider } from '@nestjs/common/interfaces';
import { AuthenticationGuard } from './authentication.guard';

export class AuthenticationModuleBuilder {
  private providers: Provider[] = [
    AuthenticationService,
    OtpEmailLoginProvider,
    SimpleTokenProvider,
    BcryptHashProvider,
    PasswordLoginProvider,
    AuthenticationGuard,
  ];
  private imports = [
    TypeOrmModule.forFeature([
      AccountEntity,
      OtpCodeEntity,
      OtpEmailCodeEntity,
      OtpSmsCodeEntity,
      AccessTokenEntity,
    ]),
  ];
  private controllers = [AuthenticationController];

  useLoginProviders(...loginProviders: Array<Type<LoginProvider>>): this {
    this.providers.push(setLoginProviders(...loginProviders));
    return this;
  }

  useTokenProvider(provider: Type<TokenProvider>): this {
    this.providers.push({
      provide: TokenProvider,
      useClass: provider,
    } as ClassProvider);
    return this;
  }

  useHashProvider(provider: Type<HashProvider>): this {
    this.providers.push({
      provide: HashProvider,
      useClass: provider,
    } as ClassProvider);
    return this;
  }

  build(): DynamicModule {
    return {
      module: AuthenticationModule,
      providers: this.providers,
      imports: this.imports,
      controllers: this.controllers,
      exports: this.providers,
    };
  }
}
