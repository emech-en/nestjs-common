import { ModuleMetadata, Provider } from '@nestjs/common/interfaces';
import { BasicAuthController } from './basic-auth.controller';
import { BasicAuthOptions, BASIC_AUTH_OPTIONS } from './basic-auth.options';
import { BasicAuthRegisterController } from './basic-auth.register.controller';
import { BasicAuthService } from './basic-auth.service';

export interface SubmoduleConfig {
  imports: any[];
  providers: Provider[];
  exports: Provider[];
  controllers: any[];
}

export function configureBasicAuth(options: BasicAuthOptions): SubmoduleConfig {
  if (!options.email?.login && !options.username?.login) {
    throw new Error('At least one login option should be provided.');
  }

  const optionsProvider: Provider = {
    provide: BASIC_AUTH_OPTIONS,
    useValue: options,
  };

  const metaData: SubmoduleConfig = {
    exports: [BasicAuthService, optionsProvider],
    providers: [BasicAuthService, optionsProvider],
    controllers: [BasicAuthController],
    imports: [],
  };

  if (options.email?.register || options.username?.register) {
    metaData.controllers?.push(BasicAuthRegisterController);
  }

  return metaData;
}
