import { Controller } from '@nestjs/common';
import { CommentService } from './comment.service';
import { MessagePattern } from '@nestjs/microservices';
import { responseSend } from 'src/model/response';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {

   
  }
  @MessagePattern("get-comment-by-id-post")
  async getCommentByIdPost(data){
    try {
      return this.commentService.getCommentsWithReplies(data);
    } catch (error) {
      console.log(error);
      
    }
  }

  @MessagePattern('create-comment')
  async createCommentByIdPost(data){
    try {
      return this.commentService.createCommentPost(data)
    } catch (error) {
      console.log(error);
      
    }
  }

  @MessagePattern('create-comment-reply')
  async createCommentReplies(data){
    try {
      return this.commentService.createReplyComment(data)
    } catch (error) {
      console.log(error);
      
    }
  }

  @MessagePattern('update-comment')
  async updateCommentByIdPost(data){
    try {
      return this.commentService.updateCommentPost(data)
    } catch (error) {
        console.log(error);
        
    }
  }

  @MessagePattern('delete-comment')
  async deleteComment(data){
    try{
      return this.commentService.deleteComment(data)
    }catch(error){
      console.log(error);
    }
  }
}
