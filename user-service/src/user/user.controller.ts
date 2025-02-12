import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TPayloadUser } from 'src/types/auth.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
   

  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('user-detail')
  findOne(id) {
    return this.userService.findOne(+id);
  }

  @MessagePattern('update-user')
  update(payload:TPayloadUser) {
    const {id,fullName,nickName,bio,phoneNumber}=payload
    const updateData={
      fullName,
      nickName,bio,phoneNumber
    }
    return this.userService.update(id,updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @MessagePattern('upload')
  async uploadAvatar(@Payload() data: { userId: number; filePath: string }) {
    console.log(data);
    
    const uploadResponse = await this.userService.updateUserAvatar(
      data.userId,
      data.filePath
    );
    return uploadResponse;
  }
}
