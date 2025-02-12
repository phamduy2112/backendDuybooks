import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { responseSend } from 'src/model/response';

@Injectable()
export class FriendsService {
  constructor(
    private readonly prismaSerive:PrismaService
  ){}

  create(createFriendDto: CreateFriendDto) {
    return 'This action adds a new friend';
  }
  async addFriend(payload: any) {
    // Kiểm tra xem ID người dùng và ID bạn có hợp lệ không
    if (!payload.id || !payload.friend_id) {
      return responseSend(null, "ID người dùng hoặc ID bạn không hợp lệ", 400);
    }
  
    try {
      const addFriend = await this.prismaSerive.friends.create({
        data: {
          user_id: +payload.id,
          friend_id: +payload.friend_id,
          status: "pending",
        },
      });
  
      return responseSend(addFriend, "Gửi lời mời kết bạn thành công", 200);
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
      return responseSend(null, "Đã xảy ra lỗi khi gửi lời mời kết bạn", 500);
    }
  }
  async statusAddFriend(status:string,id:number){
  //   if (status === 'accept') {
  //    const acceptFriend=await this.prismaSerive.friends.update({
  //     where:{
  //       id
  //     },
  //     data:{
  //       status:"accepted",
  //     }
  //    })
  //    return responseSend(acceptFriend, "Kết bạn thành công", 200);
 
  //   } else if (status === 'reject') {
  //     const acceptFriend=await this.prismaSerive.friends.update({
  //       where:{
  //         id
  //       },
  //       data:{
  //         status:"rejected",
  //       }
  //      })
  //      return responseSend(acceptFriend, "Kết bạn thành công", 200);
  // }
  //  tối ưu
  const updateStatus=status==='accept' ? 'accepted' :'rejected';
  const updateFriend=await this.prismaSerive.friends.update({
    where:{id},
    data:{status:updateStatus}
  })
  // phản hồi
  const message = status==='accept' ?'Kết bạn thành công': "Lời kết bạn đã bị từ chối"
  return responseSend(updateFriend, message, 200);
}
  findAll() {
    return `This action returns all friends`;
  }

  async findOne(id: number) {
    try {
      const getUserFriendById=await this.prismaSerive.friends.findFirst({
        where:{
          id
        }
      })
      return responseSend(getUserFriendById, "Thành công", 200);

    } catch (error) {
      console.log(error);
      
    }
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
