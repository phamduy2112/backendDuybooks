import { Injectable } from '@nestjs/common';
import { responseSend } from 'src/model/response';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
constructor(
    private readonly prismaService:PrismaService
){}

async createBlog(dataCreate) {
    try {
        const { user_id, content, visibility, files } = dataCreate; // Đổi 'file' thành 'files' để hỗ trợ nhiều ảnh

        const existingUser=await this.prismaService.users.findUnique({where:{id:user_id}});
        if(!existingUser){
            return responseSend('', 'User not found',400);
        }
        const newPost = await this.prismaService.$transaction(async (prisma) => {
            const post = await prisma.posts.create({
                data: { user_id, content, visibility }
            });

            if (files && files.length > 0) {
                await prisma.post_images.createMany({
                    data: files.map(file => ({
                        post_id: post.id,
                        image_url: file
                    }))
                });
            }

            return post;
        });

        return responseSend(newPost, "Thêm bài viết thành công", 200);
    } catch (error) {
        console.log(error);
        return responseSend(null, "Lỗi server", 500);
    }
}
async getFriendIds(userId: number): Promise<number[]> {
    const friends = await this.prismaService.friends.findMany({
      where: {
        OR: [
          { user_id: userId, status: 'accepted' },
          { friend_id: userId, status: 'accepted' },
        ],
      },
      select: {
        user_id: true,
        friend_id: true,
      },
    });
  
    const friendIds = friends.map((friend) =>
      friend.user_id === userId ? friend.friend_id : friend.user_id,
    );
  
    return friendIds;
  }
async getPostsByVisibility(userId: number, visibility: string) {
    const friendIds = await this.getFriendIds(userId);

    // friends_only
    const posts = await this.prismaService.posts.findMany({
        where: {
          visibility: visibility === 'private' ? 'private' : visibility,
          OR: [
            { user_id: userId }, // Chủ bài viết
            { user_id: { in: visibility === 'private' ? friendIds : [] } }, // Bạn bè
          ],
        },
        select: {
          id: true,
          content: true,
          created_at: true,
          users: {
            select: {
              id: true,
              full_name: true,
              avatar_url: true,
            },
          },
          post_images: {
            select: {
              image_url: true,
            },
          },
          comments: {
            take: 3,
            orderBy: { created_at: 'desc' }, // Sắp xếp comment mới nhất
            select: {
              id: true,
              content: true,
              users: {
                select: {
                  id: true,
                  full_name: true,
                  avatar_url: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc', // Sắp xếp bài viết mới nhất
        },
      });
  
      return responseSend(posts, "Thành công", 200);  
    }
async updateBlog(dataCreate){
    try {
        const {content,visibility,id}=dataCreate

       const createBlog = await this.prismaService.posts.update({
        data:{
            content,
            visibility
        },
        where:{id}
    })
    return responseSend(createBlog, "Sửa bài viết thành công", 200);  
    } catch (error) {
        
    }
   
 
}
async deleteBlog(dataCreate:{id:string}){
    try {
        const createBlog = await this.prismaService.posts.delete({
     
            where:{id:+dataCreate.id}
        })
        const deleteImage=await this.prismaService.post_images.deleteMany({
            where:{
                post_id:+dataCreate.id
            }
        })
     
        return responseSend(createBlog, "Sửa bài viết thành công", 200);
    } catch (error) {
        console.log(error);
        
    }
   
 
}
async getSavePostByIdUser(payloadData){
    const getSavePostByIdUser = await this.prismaService.posts.findMany({
        where:{
            user_id:payloadData.user_id
        }
    })
    return responseSend(getSavePostByIdUser, "Lấy danh sách bài viết thành công", 200);
}
// save blog
async savePost(dataCreate){
    // post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,  -- Bài viết được lưu
    // user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Người lưu bài viết
    const savePost=await this.prismaService.saved_posts.create({
        data:{
            post_id:dataCreate.post_id,
            user_id:dataCreate.user_id
        }
    })
    return responseSend(savePost, "Lưu bài viết thành công", 200);
}
async deleteSavePost(payloadData){
    try {
        const checkBlog=await this.prismaService.saved_posts.findFirst({
            where:{
                id:payloadData.id
            }
        })
        if(!checkBlog){
            return responseSend('',"Bài viết không tồn tại trong danh sách lưu", 404);
    
        }
        const deleteSavePost=await this.prismaService.saved_posts.delete({
            where:{
                id:payloadData.id
            }
        })
        return responseSend(deleteSavePost, "Xóa bài viết trong danh sách lưu thành công", 200);
    } catch (error) {
        console.log(error);
        
    }
   
 
}


}
