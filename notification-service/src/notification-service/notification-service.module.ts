import { Module } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { NotificationServiceController } from './notification-service.controller';

@Module({
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
