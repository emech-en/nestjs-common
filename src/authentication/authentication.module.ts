import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { PasswordController, PasswordRegisterController, PasswordService } from './password';
import { OtpEmailController, OtpSmsController } from './otp';
import { getXingLoginHtml, XING_LOGIN_HTML, XING_SIGNATURE_SALT, XingController, XingService } from './xing';
import { RegisterBaseService, RegisterService } from './register';
import { defaultsDeep } from 'lodash';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication.guard';

export interface AuthenticationModuleConfig {
  otp?: {
    email: boolean;
    sms: boolean;
  };
  password?: {
    register: boolean;
  };
  xing?: {
    consumerKey: string;
    signatureSalt: string;
  };
  registerService?: Type<RegisterService>;
}

const DEFAULT_CONFIG: AuthenticationModuleConfig = {
  otp: {
    email: true,
    sms: false,
  },
  password: {
    register: false,
  },
  registerService: RegisterBaseService,
};

@Module({})
export class AuthenticationModule {
  static forRoot(config: AuthenticationModuleConfig = {}): DynamicModule {
    config = defaultsDeep(config, DEFAULT_CONFIG);
    const registerService = {
      provide: RegisterService,
      useClass: config.registerService,
    } as Provider;

    const authGourd = {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    } as Provider;

    const controllers: any[] = [AuthenticationController];
    const exports: Provider[] = [AuthenticationService, registerService];
    const providers: Provider[] = [AuthenticationService, registerService, authGourd];

    if (config.password) {
      controllers.push(PasswordController);
      providers.push(PasswordService);
      exports.push(PasswordService);
      if (config.password.register) {
        controllers.push(PasswordRegisterController);
      }
    }

    if (config.otp && (config.otp.email || config.otp.sms)) {
      if (config.otp.sms) {
        controllers.push(OtpSmsController);
      }
      if (config.otp.email) {
        controllers.push(OtpEmailController);
      }
    }

    if (config.xing) {
      controllers.push(XingController);

      providers.push({
        useValue: getXingLoginHtml(config.xing.consumerKey),
        provide: XING_LOGIN_HTML,
      });
      providers.push({
        useValue: config.xing.signatureSalt,
        provide: XING_SIGNATURE_SALT,
      });

      providers.push(XingService);
      exports.push(XingService);
    }

    return {
      module: AuthenticationModule,
      providers,
      controllers,
      exports,
    };
  }
}
