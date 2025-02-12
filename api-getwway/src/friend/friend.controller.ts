import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('friend')
export class FriendController {
    constructor(
        @Inject("FRIEND_SERVICE") private friendService:ClientProxy
    ){}

    @Post('/add-friend/:friendId')
    async addFriend(@Param('friendId') friendId:string,@Body() payload){
      try {
        const data={
            friend_id:friendId,
            ...payload
        }
        return await lastValueFrom(this.friendService.send('add-friend',data))
      } catch (error) {
        console.log(error);
        
      }
    }

    @Get('/get-friend/:friendId')
    async getFriend(@Param('friendId') friendId:string,@Body() payload){
      try {
        const data={
            friend_id:friendId,
            ...payload
        }
// get-friend
return await lastValueFrom(this.friendService.send('get-friend',data))
} catch (error) {
        console.log(error);
        
      }
    }



    @Put('/status-update-friend/:id/:status')
    async updateStatusFriend(@Param('id') id: string,@Param('status') status:string) {
        const data={
            id,
            status
        }
        return await lastValueFrom(this.friendService.send("status-friend",data))
    
    }
  
}
