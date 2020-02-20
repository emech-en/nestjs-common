import { DynamicModule, Module, Type } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AccessTokenEntity, AccountEntity, OtpEntity } from './models';
import { AuthenticationService } from './authentication.service';
import { OnRegisterHandler } from './handlers';
import {
  PasswordController,
  PasswordRegisterController,
  PasswordService,
} from './password';
import { OtpController, OtpEmailController, OtpSmsController } from './otp';
import { TypeOrmModule } from '@nestjs/typeorm';

export interface AuthenticationModuleConfig {
  otp?: {
    email: boolean;
    sms: boolean;
  };
  password?: {
    register: boolean;
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
  static forRoot(
    config: AuthenticationModuleConfig = DEFAULT_CONFIG,
  ): DynamicModule {
    const authModule: DynamicModule = {
      module: AuthenticationModule,
      imports: [],
      controllers: [],
      exports: [],
      providers: [],
    };

    const entities: any[] = [AccountEntity, AccessTokenEntity];

    if (config.password) {
      authModule.controllers!.push(PasswordController);
      authModule.providers!.push(PasswordService);
      authModule.exports!.push(PasswordService);
      if (config.password.register) {
        authModule.controllers!.push(PasswordRegisterController);
      }
    }

    if (config.otp) {
      entities.push(OtpEntity);
      authModule.controllers!.push(OtpController);
      if (config.otp.email) {
        authModule.controllers!.push(OtpEmailController);
      }
      if (config.otp.sms) {
        authModule.controllers!.push(OtpSmsController);
      }
    }

    authModule.imports!.push(TypeOrmModule.forFeature(entities));

    return authModule;
  }
}
