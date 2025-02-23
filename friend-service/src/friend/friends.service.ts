import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { responseSend } from 'src/model/response';

@Injectable()
export class FriendsService {
  constructor(
    private readonly prismaService:PrismaService
  ){}

  create(createFriendDto: CreateFriendDto) {
    return 'This action adds a new friend';
  }
  async addFriend(payload: any) {
    // Kiểm tra xem ID người dùng và ID bạn có hợp lệ không
    if (!payload.user_id || !payload.friend_id) {
      return responseSend(null, "ID người dùng hoặc ID bạn không hợp lệ", 400);
    }
    
    try {
      const users = await this.prismaService.users.findMany({
        where: {
          id: { in: [+payload.user_id, +payload.friend_id] }
        }
      });
  
      // Kiểm tra cả hai người dùng có tồn tại không
      if (users.length < 2) {
        return responseSend(null, "Người dùng hoặc bạn không tồn tại", 400);
      }
      const existingFriendRequest = await this.prismaService.friends.findFirst({
        where: {
          OR: [
            { user_id: +payload.user_id, friend_id: +payload.friend_id },
            { user_id: +payload.friend_id, friend_id: +payload.user_id } // Để tránh gửi lại nếu đã có
          ]
        }
      });
  
      if (existingFriendRequest) {
        return responseSend(null, "Đã có lời mời kết bạn hoặc đã là bạn bè", 400);
      }
      const addFriend = await this.prismaService.friends.create({
        data: {
          user_id: +payload.user_id,
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
  async statusAddFriend(status: string, id: number, userId: number) {
    try {
      // Kiểm tra giá trị hợp lệ
      if (!["accept", "reject"].includes(status)) {
        return responseSend(null, "Trạng thái không hợp lệ", 400);
      }
  
      // Kiểm tra xem lời mời có tồn tại và đang ở trạng thái pending không
      const existingFriendRequest = await this.prismaService.friends.findUnique({
        where: { id },
      });
  
      if (!existingFriendRequest) {
        return responseSend(null, "Lời mời kết bạn không tồn tại", 404);
      }
  
      // Chỉ cho phép tài khoản được nhận lời mời chấp nhận hoặc từ chối
      if (existingFriendRequest.friend_id !== userId) {
        return responseSend(null, "Bạn không có quyền xử lý lời mời này", 403);
      }
  
      if (existingFriendRequest.status !== "pending") {
        return responseSend(null, "Lời mời kết bạn đã được xử lý", 400);
      }
  
      // Cập nhật trạng thái
      const updateStatus = status === "accept" ? "accepted" : "rejected";
      const updateFriend = await this.prismaService.friends.update({
        where: { id },
        data: { status: updateStatus },
      });
  
      // Phản hồi
      const message = status === "accept" ? "Kết bạn thành công" : "Lời kết bạn đã bị từ chối";
      return responseSend(updateFriend, message, 200);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái bạn bè:", error);
      return responseSend(null, "Đã xảy ra lỗi, vui lòng thử lại sau!", 500);
    }
  }
  findAll() {
    return `This action returns all friends`;
  }

  async findOne(id: number,status:string) {
    try {
      const existingUser=await this.prismaService.users.findFirst({
        where:{
          id
        }
      })
      if(!existingUser){
        return responseSend(null, "Người dùng không tồn tại", 404);
      }
      const getUserFriendById=await this.prismaService.friends.findFirst({
        where:{
          id,
          status,
        }
      })
      return responseSend(getUserFriendById, "Thành công", 200);

    } catch (error) {
      console.log(error);
      
    }
  }
  async getFriendsByFriendId(friendId:number){
    try {
      const existingUser=await this.prismaService.users.findFirst({
        where:{
          id:friendId
        }
      })
      if(!existingUser){
        return responseSend(null, "Người dùng không tồn tại", 404);
      }
      const friends=await this.prismaService.friends.findMany({
        where:{
          OR:[
            
            { friend_id:friendId }

          ],
          status:"accepted"
        }
      })
      return responseSend(friends, "Thành công", 200);
    } catch (error) {
      console.log(error);
    }
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  async deleteFriend(data) {

    try {
    const {user_id,id}=data;
     const checkFriendRequest=await this.prismaService.friends.findUnique({
      where: { id },
     })
     if(!checkFriendRequest){
      return responseSend(null, "Bạn không có lời mời kết bạn nào", 400);
     }
     if(checkFriendRequest.friend_id!==user_id&&checkFriendRequest.user_id!==user_id){
      return responseSend(null, "Bạn không có quyền xóa lời mời kết bạn này",401);
     }
     const deleteFriendRequest=await this.prismaService.friends.delete({
      where: { id },
     })
     return responseSend(deleteFriendRequest, "Xóa lời mời kết bạn thành công", 200);
    } catch (error) {
      
    }
  }

  async getRandomUnfriendedUsers(userId: number = 2, limit: number) {
    try {
        console.log(userId, limit);
        
        const friends = await this.prismaService.friends.findMany({
            where: {
                OR: [
                    { user_id: userId },
                    { friend_id: userId }
                ]
            },
            select: {
                user_id: true,
                friend_id: true
            }
        });

        const friendIds = new Set([
            ...friends.map(f => f.user_id),
            ...friends.map(f => f.friend_id)
        ]);

        const unfriendedUsers = await this.prismaService.users.findMany({
            where: {
                AND: [
                    { id: { not: userId } }, // Không lấy chính mình
                    { id: { notIn: Array.from(friendIds) } }, // Không lấy người đã kết bạn
                    { status: "active" } // Lấy những người có status là "active"
                ]
            },
            take: limit
        });

        return responseSend(unfriendedUsers, "Thành công!", 200);
    } catch (error) {
        console.error(error);
        return responseSend(null, "Có lỗi xảy ra!", 500);
    }
}
}
