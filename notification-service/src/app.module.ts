import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationServiceModule } from './notification-service/notification-service.module';

@Module({
  imports: [PrismaModule, NotificationServiceModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
