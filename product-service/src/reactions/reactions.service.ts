import { Injectable } from '@nestjs/common';
import { responseSend } from 'src/model/response';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReactionsService {

    constructor(
        private readonly prismaService:PrismaService
    ){

    }
    async toggleReaction(payloadData){
        const {user_id,post_id,reaction_type}=payloadData;
        const existingReaction=await this.prismaService.post_reactions.findUnique({
            where:{
                post_id_user_id:{post_id,user_id}
            }
        })
        if(existingReaction){
            if(existingReaction.reaction_type===reaction_type){
                await this.prismaService.post_reactions.delete({
                    where:{
                        post_id_user_id:{post_id,user_id},
                     
                    },
                })
                        return responseSend("", "Xóa cảm xúc thành công", 200);
                
            }else{
                await this.prismaService.post_reactions.update({
                    where:{
                        post_id_user_id:{post_id,user_id},
                     
                    },
                    data:{reaction_type}
                })
                return responseSend("", "Chỉnh cảm xúc thành công", 200);

            }
        }
        await this.prismaService.post_reactions.create({
            data: { user_id, post_id, reaction_type },
          });
          return responseSend("", "Thêm cảm xúc thành công", 200);

    }
    async getReactionByPost(payloadData){
        const [totalReactionsPost,getReactionsPost]=await Promise.all([
            this.prismaService.post_reactions.count({
                where: { post_id: payloadData.id }
            }),
            this.prismaService.post_reactions.findMany({
                where: { post_id: payloadData.id },
                include: {
                    users: {
                        select: { id: true, avatar_url: true, full_name: true }
                    }
                }
            })
        ])
         return {totalReactionsPost,getReactionsPost}
    }
    async getReactionCountsByPost(post_id: number) {
        const reactions = await this.prismaService.post_reactions.groupBy({
          by: ['reaction_type'],
          where: { post_id },
          _count: { _all: true },
        });
    
        return reactions.map((reaction) => ({
          type: reaction.reaction_type,
          count: reaction._count._all,
        }));
      }

    //   comment
    async togleReactionComment(payloadData){
        try {
            const {user_id,comment_id,reaction_type}=payloadData;
        const existingReaction=await this.prismaService.comment_reactions.findUnique({
            where:{
                comment_id_user_id:{comment_id,user_id}
            }
        })
        if(existingReaction){
            if(existingReaction.reaction_type===reaction_type){
                return this.prismaService.comment_reactions.delete({
                    where:{
                        comment_id_user_id:{comment_id,user_id},
                     
                    },
                })
            }else{
                return this.prismaService.comment_reactions.update({
                    where:{
                        comment_id_user_id:{comment_id,user_id},
                     
                    },
                    data:{reaction_type}
                })
            }
        }
        return this.prismaService.comment_reactions.create({
            data: { user_id, comment_id, reaction_type },
          });
        } catch (error) {
            console.log(error);
            
        }
    }
    async getReactionByComment(payloadData){
        const [totalReactionsComment,getReactionsComment]=await Promise.all([
            this.prismaService.comment_reactions.count({
                where:{
                    comment_id: payloadData.comment_id, 
                }
            }),
            this.prismaService.comment_reactions.findMany({
                where:{
                    id:payloadData.id
                },
                include:{
                    users:{
                        select:{
                            id:true,avatar_url:true,full_name:true
                        }
                    }
                }
            })
        ])
        return {totalReactionsComment,getReactionsComment}
    
    }
    async getReactionCountsByComment(comment_id: number) {
        const reactions = await this.prismaService.comment_reactions.groupBy({
          by: ['reaction_type'],
          where: { comment_id },
          _count: { _all: true },
        });
    
        return reactions.map((reaction) => ({
          type: reaction.reaction_type,
          count: reaction._count._all,
        }));
      }

      async getReactionPostByUser(user:any){
        try{
            const existingUser=await this.prismaService.users.findFirst({
                where:{
                    id:user.user_id
                }

            })
            if(!existingUser){
                return responseSend("", "Tài khoản không tồn tại", 404);
            }
            const reactions=await this.prismaService.posts.findMany({
                where:{
                    user_id:existingUser.id
                },
                include:{
                   
                    post_reactions:{
                        select:{
                            id:true,reaction_type:true,created_at:true,users:{
                                select:{
                                    id:true,avatar_url:true,full_name:true
                                }
                            }
                        }
                    }
                }
            })
            return responseSend(reactions, "Thành công", 200)
        }catch(e){
            console.log(e);
        }
      }
    
    }


