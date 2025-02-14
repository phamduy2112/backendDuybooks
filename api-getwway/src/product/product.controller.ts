import { BadRequestException, Body, Controller, Delete, Get, Get, Headers, Inject, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetUser } from 'src/decorator/get-user.decorator';

@Controller('product')
export class ProductController {
    constructor(
        @Inject("PRODUCT_SERVICE") private blogService:ClientProxy,
        @Inject("AUTH_SERVICE") private authService:ClientProxy,
        @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
        private readonly cloudinaryService: CloudinaryService,


    ){}
    @Post("/create-post")
    @UseInterceptors(FileInterceptor('file')) // Nhận file từ request
    async createPost(
        @GetUser() userId: number,
        @Body() payload,
        @UploadedFiles() files: any[]
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException("Cần ít nhất một hình ảnh.");
        }
    
        // Upload tất cả ảnh lên Cloudinary cùng lúc
        const uploadResponses = await Promise.all(
            files.map(file => this.cloudinaryService.uploadMedia(file.buffer))
        );
    
        // Lấy danh sách URL từ kết quả upload
        const imageUrls = uploadResponses.map(res => res.secure_url);
    
        const data = {
            user_id: userId,
            content: payload.content,
            visibility: payload.visibility,
            files: imageUrls, // Chứa danh sách ảnh
        };
    
        // Gửi dữ liệu qua microservice hoặc lưu vào database
        const response = await this.blogService.send("create-post", data);
        return response;
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
    @Delete("/delete-post")
    async deletePost( @Param('id') id: string){

                const data={
               
                    id
                }
        const responsive=await this.blogService.send("create-save-post",data)
        return responsive
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


