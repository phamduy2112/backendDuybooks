import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('reactions')
export class ReactionsController {
    constructor(

                @Inject("PRODUCT_SERVICE") private  reactions:ClientProxy,
                @Inject("AUTH_SERVICE") private authService:ClientProxy,
                @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
        
    ) {}
}
