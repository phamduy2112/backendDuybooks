import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.RMQ,
    options:{
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'notification_queue',
      queueOptions: {
      durable: false // server RabbitMq retart: false queue sẽ mất true thì còn
      }
      }
      
  });
  await app.listen();
  // custom service
}
bootstrap();