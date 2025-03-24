import { Body, Controller, Get, Inject,Headers, Param, Post, Put, Delete, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { log } from 'console';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Controller('reactions')
export class ReactionsController {
    constructor(

                @Inject("PRODUCT_SERVICE") private  reactions:ClientProxy,
                @Inject("AUTH_SERVICE") private authService:ClientProxy,
                @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
        
    ) {}
    @Post("reaction-post")
    async createReaction(
      @Headers("authorization") authHeader: string,
      @Body() reaction: any,
    ) {
      try {
        const decoded = await firstValueFrom(this.authService.send("verify-token", { authHeader }));
        console.log(decoded); // Debug xem token có hợp lệ không
        // user_id,post_id,reaction_type
        if (!decoded?.id) {
          throw new Error("Invalid token");
        }
  
        const userId = +decoded.id;
        const data = {
          post_id: +reaction.post_id,
          user_id: userId,
          reaction_type: reaction.reaction_type
        };
  
        return await lastValueFrom(this.reactions.send('toggle-reactions-post', data));
      } catch (error) {
        console.error("Error in createReaction:", error);
      }
    }

    @Get("/reaction-post")
    async getAllReactionsPost(
      @Query("post_id") post_id: string, // Lấy từ query param
    ) {
        const data = { id: +post_id };
        console.log(data);
        return await lastValueFrom(this.reactions.send("get-reactions-by-post", data));
    }

    @Get("/reactions-by-user")
    async getReactionByUser(
      @Headers("authorization") authHeader: string,

    ){
      try{
        const decoded = await firstValueFrom(this.authService.send("verify-token", { authHeader }));
        // user_id,post_id,reaction_type
        if (!decoded?.id) {
          throw new Error("Invalid token");
        }
  
        const userId = +decoded.id;
        const data = {
          user_id: userId,
        };
        console.log(data)
        return await lastValueFrom(this.reactions.send("get-reactions-by-user", data));
      }catch(e){
        return e
      }
    }
  }