import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationServiceDto } from './create-notification-service.dto';

export class UpdateNotificationServiceDto extends PartialType(CreateNotificationServiceDto) {}
