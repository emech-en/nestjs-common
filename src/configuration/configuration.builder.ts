import { DynamicModule, Type, ValueProvider } from '@nestjs/common/interfaces';
import { ConfigurationModule } from './configuration.module';

export class ConfigurationModuleBuilder {
  private providers: Array<ValueProvider<any>> = [];

  addConfig<T, G extends Type<T>>(type: G, value: T): ConfigurationModuleBuilder {
    this.providers.push({
      useValue: value,
      provide: type,
    });
    return this;
  }

  build(): DynamicModule {
    return {
      module: ConfigurationModule,
      providers: this.providers,
      exports: this.providers,
    };
  }
}
