import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GetUser } from 'src/decorator/get-user.decorator';

@Controller('comment')
export class CommentController {
    constructor(

                @Inject("PRODUCT_SERVICE") private commentService:ClientProxy,
        
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
     async createComment(@Body() comment: any, @GetUser() userId: number): Promise<any> {
      try {
         const data={
            post_id:comment.post_id,
            user_id:userId,
            content:comment.content
         }
         return await lastValueFrom(this.commentService.send('create-comment',data))
      } catch (error) {
         
      }
  
    
     }
     @Post('create-comment-reply')
     async createCommentReplies(@Body() comment: any, @GetUser() userId: number): Promise<any> {
      try {
         //  post_id, user_id, content, parent_id
         const data={
            post_id:comment.post_id,
            user_id:userId,
            content:comment.content,
            parent_id:comment.parent_id
         }
         return await lastValueFrom(this.commentService.send('create-comment',data))
      } catch (error) {
         
      }
  
    
     }

     @Put('update-comment/:id')
     async updateCommentPost(@Param('id') id:string){
      try {
         const data={
            id
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
