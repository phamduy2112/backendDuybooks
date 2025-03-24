import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { CreateNotificationServiceDto } from './dto/create-notification-service.dto';
import { UpdateNotificationServiceDto } from './dto/update-notification-service.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('notification-service')
export class NotificationServiceController {
  constructor(private readonly notificationServiceService: NotificationServiceService) {}



  @EventPattern('user_updated')


  createNotification(data:CreateNotificationServiceDto) {
    console.log(data);
    
    return this.notificationServiceService.createNotification(data);
  }

  @EventPattern('get-notifications-by-user')
  getNotificationByIdUser(data:{userId: number}) {

    return this.notificationServiceService.findAll(data.userId);
  }
  @EventPattern('mark-as-read')
  markAsRead(data:{notificationId: number}){
    return this.notificationServiceService.markAsRead(data.notificationId)
  }

 
}
