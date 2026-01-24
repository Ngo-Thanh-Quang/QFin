import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
  }));
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 5000);
  console.log(`Backend server running on port ${process.env.PORT || 5000}`);
}
bootstrap();
