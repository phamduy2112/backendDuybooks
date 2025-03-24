import { Body, Controller, Get, Inject,Headers, Param, Post, Put, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GetUser } from 'src/decorator/get-user.decorator';

@Controller('friend')
export class FriendController {
    constructor(
        @Inject("USER_SERVICE") private friendService:ClientProxy,
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
            friend_id:+friendId,
            user_id:userId
        }
        console.log(data)

        return await lastValueFrom(this.friendService.send('add-friend',data))
      } catch (error) {
        console.log(error);
        
      }
    }

  
    @Get('/get-friend-list-user')
    async getFriend(
      @Headers("authorization") authHeader: string,
      @Body() payload
    ) {
      try {
        let userId: number;
    
        if (authHeader) {
          // Nếu có token, giải mã để lấy userId
          const decoded = await firstValueFrom(this.authService.send("verify-token", { authHeader }));
          userId = +decoded.id;
        } else if (payload.userId) {
          // Nếu không có token, lấy userId từ payload
          userId = +payload.userId;
        } else {
          // return responseSend(null, "Thiếu thông tin người dùng", 400);
        }
    
        // Chuẩn bị dữ liệu gửi sang microservice
        const data = {
          userId,
          status: payload.status || "accepted", // Mặc định là "accepted"
        };
    
        return await lastValueFrom(this.friendService.send('get-friend-by-id', data));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
        // return responseSend(null, "Đã xảy ra lỗi, vui lòng thử lại sau!", 500);
      }
    }
    



    @Put('/change/:id/:status')
    async updateStatusFriend(@Param('id') id: string,@Param('status') status:string,@Headers("authorization") authHeader:string) {
      const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
      const userId=+decoded.id;
      const data={
            id:+id,
            status,
            userId
        }
        return await lastValueFrom(this.friendService.send("status-friend",data))
    
    }
    @Delete('delete/:id')
    async deleteFriend(@Param('id') id: string, @Headers("authorization") authHeader:string) {
      const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
      const userId=+decoded.id;
        const data={
            id,
          user_id:userId
        }
        return await lastValueFrom(this.friendService.send("delete-friend",data))
    
    }
  
    @Get('get-random-friends-no-add-friend/:limit')
    async getRandomFriendsNoAddFriend(@Headers("authorization") authHeader:string,    @Param('limit') limit:string){
      const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
                        const userId=+decoded.id;

      const data={
        userId,
        limit
    }
// console.log(data);

    return await lastValueFrom(this.friendService.send("get-random-friends-no-add-friend",data))
    }  
    
}
