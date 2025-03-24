import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './../../../social-frontend/src/hooks/exception.filter';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ServiceModule } from './service/service.module';
import { PrismaModule } from './prisma/prisma.module';
import { FriendsModule } from './friend/friends.module';

@Module({
  imports: [ServiceModule, PrismaModule, FriendsModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
    PrismaService,
  ],
})
export class AppModule {}
