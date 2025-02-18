import { Body, Controller, Get, Inject,Headers, Param, Post, Put, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GetUser } from 'src/decorator/get-user.decorator';

@Controller('friend')
export class FriendController {
    constructor(
        @Inject("FRIEND_SERVICE") private friendService:ClientProxy,
        @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
        @Inject("AUTH_SERVICE") private authService:ClientProxy,

    ){}

    @Post('/add-friend/:friendId')
    async addFriend(
      @Headers("authorization") authHeader:string,
      
      @Param('friendId') friendId:string

  
  ){
      try {
          const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
                        const userId=+decoded.id;
        const data={
            friend_id:friendId,
            user_id:userId
        }

        return await lastValueFrom(this.friendService.send('add-friend',data))
      } catch (error) {
        console.log(error);
        
      }
    }

    @Get('/get-friend/:friendId')
    async getFriendById(@Param('friendId') friendId: string) {
        return await lastValueFrom(this.friendService.send("get-friend-by-id-friend",friendId))
    
    }
    @Get('/get-friend-list-user')
    async getFriend(
      @Headers("authorization") authHeader:string,

      @Body() payload){
      try {
        const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
        const userId=+decoded.id;
        const data={
            user_id:userId,
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
    @Delete('delete-friend/:id')
    async deleteFriend(@Param('id') id: string, @Headers("authorization") authHeader:string) {
      const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
      const userId=+decoded.id;
        const data={
            id,
          user_id:userId
        }
        return await lastValueFrom(this.friendService.send("delete-friend",data))
    
    }
  
}
