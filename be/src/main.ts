import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './infrastructure/config/env-config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get(EnvVariables.PORT);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(PORT);
}

bootstrap();
