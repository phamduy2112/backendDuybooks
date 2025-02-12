import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Bật CORS với cấu hình NestJS
  app.enableCors({
    origin: '*', // Cho phép mọi nguồn gốc
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  await app.listen(8000);
}
bootstrap();