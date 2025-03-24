import { Body, Controller, Delete, Get, Headers, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GetUser } from 'src/decorator/get-user.decorator';

@Controller('comment')
export class CommentController {
    constructor(

                @Inject("PRODUCT_SERVICE") private commentService:ClientProxy,
                @Inject("AUTH_SERVICE") private authService:ClientProxy,

     ) {}

     @Get('get-comment-by-id-post')
     async getCommentByIdPost(@Query('post_id') post_id:string): Promise<any> {
        try {
         const data={
            post_id
         }
                    return await lastValueFrom(this.commentService.send('get-comment-by-id-post',data))
            
        } catch (error) {
            
        }

     }

     @Post('create-comment')
     async createComment(
      @Headers("authorization") authHeader:string, 
     @Body() comment: any
   ) {
      try {
         const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
            const userId=+decoded.id;
         const data={
            post_id:+comment.post_id,
            user_id:userId,
            content:comment.content
         }
         return await lastValueFrom(this.commentService.send('create-comment',data))
      } catch (error) {
         
      }
  
    
     }
     @Post('create-comment-reply')
     async createCommentReplies(@Body() comment: any,
     @Headers("authorization") authHeader:string,
   
   
   ): Promise<any> {
      try {
         const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
         const userId=+decoded.id;
         //  post_id, user_id, content, parent_id
         const data={
            post_id:+comment.post_id,
            user_id:userId,
            content:comment.content,
            parent_id:+comment.parent_id
         }
         return await lastValueFrom(this.commentService.send('create-comment-reply',data))
      } catch (error) {
         
      }
  
    
     }

     @Put('update-comment/:id')
     async updateCommentPost(@Param('id') id:string,@Body() comment: any): Promise<any> {
      try {
         const data={
            id:+id,
            content:comment.content
         }
         return await lastValueFrom(this.commentService.send('update-comment',data))
      } catch (error) {
         
      }
     }
     @Delete('delete-comment/:id')
     async deleteCommentPost(@Param('id') id:string){
      try {
         const data={
            id
         }
         return await lastValueFrom(this.commentService.send('detele-comment',data))
      } catch (error) {
         
      }
     }
}
