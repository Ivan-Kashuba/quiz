import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const APP_PREFIX = '/api';

// Используем данную функцию в main.ts и в e2e тестах
export const applyAppSettings = (app: INestApplication) => {
  setAppPrefix(app);

  setSwagger(app);

  setAppPipes(app);
};

const setAppPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(APP_PREFIX);
};

const setSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Quiz API')
    .addBasicAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('', app, document);
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const customErrors = [];

        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints);

          constraintKeys.forEach((cKey) => {
            const msg = e.constraints[cKey];

            customErrors.push({ key: e.property, message: msg });
          });
        });

        throw new BadRequestException(customErrors);
      },
    }),
  );
};
