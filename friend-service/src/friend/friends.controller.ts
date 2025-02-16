import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendsService.create(createFriendDto);
  }


  findAll() {
    return this.friendsService.findAll();
  }

  @MessagePattern('get-friend')
  findOne(payload:any) {
    try {
      return this.friendsService.findOne(+payload.friend_id);

    } catch (error) {
        console.log(error);
        
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(+id, updateFriendDto);
  }

@MessagePattern('add-friend')
addFriend(payload: any) {
  return this.friendsService.addFriend(payload)
}

  @MessagePattern('status-friend')
  updateStatusFriend(data) {
    return this.friendsService.statusAddFriend(data.status,+data.id,data.user_id);
  }

  @MessagePattern('delete-friend')
  remove(payload:any) {
    return this.friendsService.deleteFriend(payload);
  }
}
