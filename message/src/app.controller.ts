import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { MessageService } from './message.service';

@Controller()
export class AppController {
  private groups: Group[] = [];
  private messages: Message[] = [];

  // 1️⃣ Tạo nhóm chat
  @MessagePattern('create_group')
  createGroup(data: { name: string; members: string[] }) {
    const newGroup: Group = {
      id: Math.random().toString(36).substring(7), // Tạo ID random
      name: data.name,
      members: data.members
    };
    this.groups.push(newGroup);
    return newGroup;
  }

  // 2️⃣ Lấy danh sách nhóm
  @MessagePattern('get_groups')
  getGroups() {
    return this.groups;
  }
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
