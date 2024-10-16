import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './infrastructure/config/env-config';
import { applyAppSettings } from './settings/apply-app-setting';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get(EnvVariables.PORT);

  applyAppSettings(app);

  await app.listen(PORT);
}

bootstrap();
