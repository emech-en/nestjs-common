import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as pkgInfo from '../../package.json';
import { ClassSerializerInterceptor, INestApplication, Logger, ValidationPipe } from '@nestjs/common';

function configSwaggerDoc(app: INestApplication) {
  if (process.env.HIDE_DOC === 'TRUE' || process.env.HIDE_DOC === 'true') {
    return;
  }
  const options = new DocumentBuilder()
    .setTitle('Nestjs Example')
    .setDescription('A sample usage of the @emech/nestjs-common package.')
    .setVersion(pkgInfo.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  configSwaggerDoc(app);

  await app.listen(3000);
}

bootstrap().catch((e) => {
  Logger.error(e.message);
  process.exit(1);
});
