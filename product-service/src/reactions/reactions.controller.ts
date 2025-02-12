import { Controller } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @MessagePattern('toggle-reactions-post')
  async ToggleReactsPost(data){
    return this.reactionsService.toggleReaction(data);
  }

  @MessagePattern('toggle-reactions-comment')
  async ToggleReactiosComment(data){
    return this.reactionsService.togleReactionComment(data)
  }

  @MessagePattern('get-reactions-by-post')
  async getReactiosByPost(data){
    return this.reactionsService.getReactionByPost(data)
  }
  
  @MessagePattern("get-reactions-by-comment")
  async getReactiosByComment(data){
    return this.reactionsService.getReactionByComment(data)
  }

  @MessagePattern("get-reactions-by-post")
  async getReactionByPost(data){

    return this.reactionsService.getReactionCountsByPost(data)
  }

  @MessagePattern("get-reactions-by-comment")
  async getReactionByComment(data){

    return this.reactionsService.getReactionCountsByComment(data)
  }
}
