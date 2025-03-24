import { Body, Controller, Get, Headers, Inject, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('user')
export class UserController {
    constructor(
        @Inject("USER_SERVICE") private userService:ClientProxy,
        @Inject("AUTH_SERVICE") private authService:ClientProxy,
        @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
        private readonly cloudinaryService: CloudinaryService,

    ){

    }
    
    @Get("/get-user-by-id")
    async getUserById(@Headers("authorization") authHeader:string){
        const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
        const userId=decoded.id;
  
        
        const getUserbyId=await lastValueFrom(this.userService.send("user-detail",userId))
     
        if(getUserbyId.message=='Thành công'){
          const data={
            user_id:userId,
            message:'Lấy người dùng thành công',
            type:'update'
          }
     
        }
        
        return getUserbyId
        
    }
    @Put('update-user')
    async updateUser(@Headers("authorization") authHeader:string,@Body() payload){
      const decoded=await firstValueFrom(this.authService.send("verify-token",{authHeader}))
      const userId=decoded.id;
      console.log(decoded);
      const dataUpdate={
        id:userId,
        ...payload
      }
      this.notificationService.emit('user_updated', dataUpdate)
      
      const getUserbyId=await lastValueFrom(this.userService.send("update-user",dataUpdate))
      console.log(getUserbyId);
      if(getUserbyId.message=='Thành công'){
        const data={
          user_id:userId,
          message:'Lấy người dùng thành công',
          type:'update'
        }
    this.notificationService.emit('user_updated', data)
      }
      
      return dataUpdate
      
  }
    @Post('upload-img')
    @UseInterceptors(FileInterceptor('file')) // Nhận file từ request

    async uploadImgUser(@Headers("authorization") authHeader:string,@UploadedFile() file: any){
   try{
    const userId=1
    console.log(file);

        
    const uploadResponse = await this.cloudinaryService.uploadMedia(file.buffer);
    
    
// Gửi dữ liệu userId và filePath đến microservice upload
const payload={ userId, filePath: uploadResponse.secure_url }
const updateAvatar = await firstValueFrom(
  this.userService.send("upload", payload)
);

return {
  message: "Upload1 thành công",
  url: uploadResponse.secure_url,
};
   }catch(e){
    console.log(e);
    
   }

    }
}
