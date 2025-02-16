import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('image')
export class ImageController {
        constructor(    private readonly prismaService:PrismaService
        ){

        }
        @MessagePattern('get-image-post')
        async getImagePostById(data: { id: number }) {
            try {
                // Tìm tất cả ảnh liên quan đến bài viết
                const images = await this.prismaService.post_images.findMany({
                    where: { post_id: +data.id }, // Đảm bảo `post_id` là số
                    select: { image_url: true } // Chỉ lấy `image_url`, tránh lấy dữ liệu không cần thiết
                });
        
                return images;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách hình ảnh:", error);
                throw new Error("Không thể lấy danh sách hình ảnh");
            }
        }
            

}
