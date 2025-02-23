import { BadRequestException, Body, Controller, Delete, Get, Headers, Inject, InternalServerErrorException, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetUser } from 'src/decorator/get-user.decorator';

@Controller('post')
export class ProductController {
    constructor(
        @Inject("PRODUCT_SERVICE") private blogService:ClientProxy,
        @Inject("AUTH_SERVICE") private authService:ClientProxy,
        @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
        private readonly cloudinaryService: CloudinaryService,


    ){}
    @Post("create-post")
    @UseInterceptors(FilesInterceptor('files', 10)) // Nhận tối đa 10 file
    async createPost(
        @Headers("authorization") authHeader: string,
        @Body() payload,
        @UploadedFiles() files?: any[]
    ) {
        try {
            const decoded = await firstValueFrom(this.authService.send("verify-token", { authHeader }));
            const userId = decoded.id;
    
            let imageUrls: string[] = [];
    
            // Nếu có file ảnh, upload lên Cloudinary
            if (files && files.length > 0) {
                const uploadResponses = await Promise.all(
                    files.map(file => this.cloudinaryService.uploadMedia(file.buffer))
                );
                imageUrls = uploadResponses.map(res => res.secure_url);
            }
    
            // Tạo object data, chỉ thêm files nếu có ảnh
            const data: any = {
                user_id: Number(userId),
                content: payload.content,
                visibility: payload.visibility,
            };
    
            if (imageUrls.length > 0) {
                data.files = imageUrls;
            }
    
            // Gửi dữ liệu qua microservice hoặc lưu vào database
            const response = await this.blogService.send("create-post", data);
            return response;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Lỗi tạo bài viết");
        }
    }
    
    private getCloudinaryPublicId(imageUrl: string): string {
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1]; // Lấy tên file có đuôi .jpg, .png
        return filename.split('.')[0]; // Bỏ phần mở rộng
    }
    @Get("/get-save-post")
    
    async getSaveBlog(@Headers("authorization") authHeader:string,@GetUser() userId: number){
         
        const responsive=await this.blogService.send("get-save-blog",userId)
        return responsive
    }
    @Post("/create-save-post")
    async createSaveBlog(@Headers("authorization") authHeader:string,@Param('id') post_id: string){
           const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
                const userId=decoded.id;
                const data={
                    user_id:userId,
                    post_id
                }
        const responsive=await this.blogService.send("create-save-post",data)
        return responsive
    }
    @Delete("/delete-save-post")
    async deleteSavePost(    @GetUser() userId: number, @Param('id') id: string){
        
                const data={
                    user_id:userId,
                    id
                }
        const responsive=await this.blogService.send("create-save-post",data)
        return responsive
    }
    @Put("/update-post")
    async updatePost(    @GetUser() userId: number, @Param('id') id: string,@Body() payload){
        const {content,visibility}=payload
                const data={
                    content,visibility,
                    id
                }
        const responsive=await this.blogService.send("create-save-post",data)
        return responsive
    }
    @Delete("/delete-post/:id") 
    async deletePost(@Param('id') id: string) {
        try {
            const data = { id };
    
            // 1️⃣ Gọi API từ blog service để lấy danh sách hình ảnh của bài viết
            const getImagePostById: { image_url: string }[] = await lastValueFrom(
                this.blogService.send('get-image-post', data)
            );
    

                
            // // 2️⃣ Xóa hình ảnh trên Cloudinary
            for (const image of getImagePostById) { // ✅ Dùng getImagePostById, không phải postImages
                const publicId = this.getCloudinaryPublicId(image.image_url);
                console.log(publicId);
                
                await this.cloudinaryService.deleteMedia(publicId);
            }
    
            // // 3️⃣ Gửi request xóa bài viết đến blog service
            const response = await lastValueFrom(this.blogService.send("delete-post", data));
    
            return response;
        } catch (error) {
            console.error("Lỗi khi xóa bài viết:", error);
            throw new InternalServerErrorException("Không thể xóa bài viết");
        }
    }
@Get('get-post')
async getPost( @Param('id') id: string,@Body() payload){

    const data={
   
        id,
        visibility:payload.visibility
    }
const responsive=await this.blogService.send("get-post",data)
return responsive
}
 
    
}


