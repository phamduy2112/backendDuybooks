import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('message')
export class MessageController {
    constructor(
                @Inject("MESSAGE_SERVICE") private messageService:ClientProxy,
        
    ) {}

    @Post('send')
    sendMessage(@Body() payload: { sender: string; message: string }) {
        console.log('Sending message to Message Service:', payload);

        return this.messageService.send('newMessage', payload).toPromise();
    }
}
