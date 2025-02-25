import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  private messages = [
    { sender: 'Alice', message: 'Hello from API Gateway' },
    { sender: 'Bob', message: 'Hi Alice!' }
  ];
  
  saveMessage(payload: { sender: string; message: string }) {
    console.log('Saving message:', payload);
    return { status: 'success', message: 'Message saved successfully' };
  }
  getMessages() {
    return this.messages;
  }
}