import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Increase the limit as needed (here set to 50mb)
  app.use(express.json({ limit: '50mb' }));
  await app.listen(3000);
}
bootstrap();
