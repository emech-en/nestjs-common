import { DynamicModule, HttpModule, Module, Provider, Type } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { OtpEmailController, OtpSmsController } from './otp';
import { getXingLoginHtml, XING_LOGIN_HTML, XING_SIGNATURE_SALT, XingController, XingService } from './xing';
import { RegisterBaseService, RegisterService } from './register';
import { defaultsDeep } from 'lodash';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication.guard';
import { FbController, FBService } from './fb';
import { GoogleContorller, GoogleService, GOOGLE_WEB_CLIENT_ID } from './google';
import { BasicAuthDefaults, BasicAuthOptions, configureBasicAuth } from './basic-auth';

export interface AuthenticationModuleConfig {
  otp?: {
    email: boolean;
    sms: boolean;
  };
  basicAuth?: BasicAuthOptions;
  xing?: {
    consumerKey: string;
    redirectUrl: string;
    buttonText: string;
    linkText: string;
    signatureSalt: string;
  };
  facebook?: {
    enabled: boolean;
  };
  google?: {
    webClientID: string;
  };
  registerService?: Type<RegisterService>;
}

const DEFAULT_CONFIG: AuthenticationModuleConfig = {
  otp: {
    email: true,
    sms: false,
  },
  basicAuth: BasicAuthDefaults,
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

    const imports: any[] = [HttpModule];
    const controllers: any[] = [AuthenticationController];
    const exports: Provider[] = [AuthenticationService, registerService];
    const providers: Provider[] = [AuthenticationService, registerService, authGourd];

    if (config.basicAuth) {
      const basicAuth = configureBasicAuth(config.basicAuth);
      imports.push(...basicAuth.imports);
      providers.push(...basicAuth.providers);
      exports.push(...basicAuth.exports);
      controllers.push(...basicAuth.controllers);
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
        useValue: getXingLoginHtml({
          consumerKey: config.xing.consumerKey,
          redirectUrl: config.xing.redirectUrl,
          buttonText: config.xing.buttonText,
          linkText: config.xing.linkText,
        }),
        provide: XING_LOGIN_HTML,
      });
      providers.push({
        useValue: config.xing.signatureSalt,
        provide: XING_SIGNATURE_SALT,
      });

      providers.push(XingService);
      exports.push(XingService);
    }

    if (config.facebook && config.facebook.enabled) {
      controllers.push(FbController);
      providers.push(FBService);
      exports.push(FBService);
    }

    if (config.google) {
      controllers.push(GoogleContorller);
      providers.push(GoogleService);
      exports.push(GoogleService);
      providers.push({
        useValue: config.google.webClientID,
        provide: GOOGLE_WEB_CLIENT_ID,
      });
    }

    return {
      module: AuthenticationModule,
      imports,
      providers,
      controllers,
      exports,
    };
  }
}
