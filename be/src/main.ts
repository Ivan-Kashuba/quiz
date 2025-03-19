import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './infrastructure/config/env-config';
import { applyAppSettings } from './settings/apply-app-setting';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get(EnvVariables.PORT);

  applyAppSettings(app);

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(PORT);
}

bootstrap();
