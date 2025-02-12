import { Injectable } from '@nestjs/common';
import { responseSend } from 'src/model/response';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
    constructor(
        private prismaService:PrismaService,

    ){}

    async getCommentsWithReplies(post_id: number) {
        try {
            const comments = await this.prismaService.comments.findMany({
                where: {
                    post_id,
                    parent_id: null // Chỉ lấy bình luận gốc (không phải reply)
                },
                orderBy: { created_at: 'asc' }, // Sắp xếp theo thời gian
                include: {
                    other_comments: { // Lấy danh sách reply (other_comments chính là các reply)
                        orderBy: { created_at: 'asc' }
                    }
                }
            });
    
            return responseSend(comments, "Lấy danh sách bình luận thành công", 200);
        } catch (error) {
            console.error("Lỗi khi lấy bình luận:", error);
            return responseSend(null, "Lỗi server", 500);
        }
    }
    async createCommentPost(dataComment){
         try {
            const {post_id,user_id,content}=dataComment;
            const existingPosts=await this.prismaService.posts.findUnique({
                where:{
                    id:post_id
                }
            })
            if(!existingPosts){
                return responseSend(null,"Mã sản phẩm không tồn tại",400)
            }
            const existingUser=await this.prismaService.users.findUnique({
                where:{
                    id:user_id
                }
            })
            if(!existingUser){
                return responseSend(null,"Người dùng không tồn tại",400)
            }
            const createCommentByPost=await this.prismaService.comments.create({
                data:{
                    post_id,
                    user_id,
                    parent_id:null,
                    content,

                },
                include:{
                    users:{
                        select:{
                            id:true,avatar_url:true,full_name:true
                        }
                    }
            }
        }
        )

            return responseSend(createCommentByPost,"Thành công",200)

         } catch (error) {
            console.log(error);
            
         }
    }
    async createReplyComment(dataReply) {
        try {
            const { post_id, user_id, content, parent_id } = dataReply;
    
            // Kiểm tra bài viết có tồn tại không
            const existingPost = await this.prismaService.posts.findUnique({
                where: { id: post_id }
            });
    
            if (!existingPost) {
                return responseSend(null, "Bài viết không tồn tại", 400);
            }
    
            // Kiểm tra người dùng có tồn tại không
            const existingUser = await this.prismaService.users.findUnique({
                where: { id: user_id }
            });
    
            if (!existingUser) {
                return responseSend(null, "Người dùng không tồn tại", 400);
            }
    
            // Kiểm tra bình luận cha có tồn tại không
            const parentComment = await this.prismaService.comments.findUnique({
                where: { id: parent_id }
            });
    
            if (!parentComment) {
                return responseSend(null, "Bình luận gốc không tồn tại", 400);
            }
    
            // Tạo reply
            const createReply = await this.prismaService.comments.create({
                data: {
                    post_id,
                    user_id,
                    content,
                    parent_id
                }
            });
    
            return responseSend(createReply, "Phản hồi bình luận thành công!", 200);
        } catch (error) {
            console.error("Lỗi khi tạo reply:", error);
            return responseSend(null, "Lỗi server", 500);
        }
    }
    async updateCommentPost(dataComment){
        try {
            const existingCommentByIdPost=await this.prismaService.comments.findUnique({
                where:{
                    id:dataComment.id
                }
            })
            if(!existingCommentByIdPost){
                return responseSend(null,"Comment không tồn tại",400)
            }
            const updateCommentByIdPost=await this.prismaService.comments.update({
                where:{
                    id:dataComment.id
                },
                data:{
                    content:dataComment.content
                }
            })
            return responseSend(updateCommentByIdPost,'Thành công',200)
        } catch (error) {
            console.log(error);
            
        }
    }

    async deleteComment(comment_id: number) {
        try {
            // Kiểm tra xem bình luận có tồn tại không
            const existingComment = await this.prismaService.comments.findUnique({
                where: { id: comment_id },
                include: { other_comments: true } // Lấy danh sách reply
            });
    
            if (!existingComment) return responseSend(null, "Bình luận không tồn tại", 400);
    
            // Nếu là bình luận cha, xóa luôn cả reply
            if (existingComment.other_comments.length > 0) {
                await this.prismaService.comments.deleteMany({
                    where: { parent_id: comment_id }
                });
            }
    
            // Xóa bình luận chính
            await this.prismaService.comments.delete({
                where: { id: comment_id }
            });
    
            return responseSend(null, "Xóa bình luận thành công!", 200);
        } catch (error) {
            console.error("Lỗi khi xóa bình luận:", error);
            return responseSend(null, "Lỗi server", 500);
        }
    }

}
