import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { MessageService } from './message.service';

@Controller()
export class AppController {
  constructor(private readonly messageService: MessageService) {}
  @MessagePattern('newMessage')
  handleNewMessage(payload: { sender: string; message: string }) {
    return this.messageService.saveMessage(payload);
  }

  @MessagePattern('getMessage')
  handleGetMessages(){
    return this.messageService.getMessages()
  }
}
