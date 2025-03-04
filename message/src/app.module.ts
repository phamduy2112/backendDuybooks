import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageService } from './message.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,MessageService],
})
export class AppModule {}
