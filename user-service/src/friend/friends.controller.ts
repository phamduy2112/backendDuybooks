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

  @MessagePattern('get-friend-by-id')
  getFriendsByFriendId(dataFriends) {
    const {userId,status}=dataFriends
    return this.friendsService.getFriendsById(+userId,status);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(+id, updateFriendDto);
  }

@MessagePattern('add-friend')
addFriend(payload: CreateFriendDto) {
  return this.friendsService.addFriend(payload)
}

  @MessagePattern('status-friend')
  updateStatusFriend(data) {
    return this.friendsService.statusAddFriend(data.status,+data.id,data.userId);
  }

  @MessagePattern('delete-friend')
  remove(payload:any) {
    return this.friendsService.deleteFriend(payload);
  }

  @MessagePattern('get-random-friends-no-add-friend')
  getRandomFriendsNoAddFriend(payload){
    const {user_id,limit}=payload
    return this.friendsService.getRandomUnfriendedUsers(user_id,+limit)
  }

}
