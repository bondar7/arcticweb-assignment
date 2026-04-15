import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>('PORT') ?? '3002');
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Lead Tracker API')
    .setDescription('Infrastructure-only API for the Lead Tracker assignment')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
}

void bootstrap();
