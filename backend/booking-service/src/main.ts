import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors({ origin: process.env.PUBLIC_WEB_ORIGIN || 'http://localhost:3000', allowedHeaders: ['Authorization', 'Content-Type', 'Idempotency-Key'], methods: ['GET', 'POST', 'OPTIONS'] });
  app.enableShutdownHooks();
  const port = Number(process.env.PORT ?? 3103);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
