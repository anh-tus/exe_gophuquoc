import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableShutdownHooks();
  const port = Number(process.env.PORT ?? 3101);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
