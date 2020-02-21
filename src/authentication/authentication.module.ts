import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AccessTokenEntity, AccountEntity, OtpEntity } from './models';
import { AuthenticationService } from './authentication.service';
import { OnRegisterHandler } from './handlers';
import { PasswordController, PasswordRegisterController, PasswordService } from './password';
import { OtpController, OtpEmailController, OtpSmsController } from './otp';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getXingLoginHtml, XING_LOGIN_HTML, XING_SIGNATURE_SALT, XingController, XingService } from './xing';

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
  onRegister?: Type<OnRegisterHandler>;
}

const DEFAULT_CONFIG: AuthenticationModuleConfig = {
  otp: {
    email: true,
    sms: false,
  },
  password: {
    register: false,
  },
};

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {
  static forRoot(config: AuthenticationModuleConfig = DEFAULT_CONFIG): DynamicModule {
    const imports = [];
    const controllers = [];
    const exports = [];
    const providers: Provider[] = [];
    const entities: any[] = [AccountEntity, AccessTokenEntity];

    if (config.password) {
      controllers.push(PasswordController);
      providers.push(PasswordService);
      exports.push(PasswordService);
      if (config.password.register) {
        controllers.push(PasswordRegisterController);
      }
    }

    if (config.otp) {
      entities.push(OtpEntity);
      controllers.push(OtpController);
      if (config.otp.email) {
        controllers.push(OtpEmailController);
      }
      if (config.otp.sms) {
        controllers.push(OtpSmsController);
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
      imports.push(TypeOrmModule.forFeature(entities));
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
