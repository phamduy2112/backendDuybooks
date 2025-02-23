import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { responseSend } from 'src/model/response';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
     private readonly cloudinaryService: CloudinaryService
  ){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const userDetail= await this.prismaService.users.findFirst({
      where:{
        id
      }
    });
    if(!userDetail){
      return responseSend('', "Không thấy người dùng", 400);
    }
    return responseSend(userDetail, "Thành công", 200);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
  await this.prismaService.users.update({
      where: { id: id }, // Điều kiện tìm kiếm người dùng
      data: updateUserDto, // Dữ liệu cập nhật
  });
  const userDetail = await this.prismaService.users.findFirst({
    where: { id: id }
  })
  return responseSend(userDetail, "Cập nhận người dùng thành công!", 200);
}  

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async updateUserAvatar(userId: number, file: string): Promise<string> {

    // Cập nhật avatar trong Prisma
    await this.prismaService.users.update({
      where: { id: userId }, // ✅ Điều kiện tìm user
      data: { avatar_url: file }, // ✅ Dữ liệu cần cập nhật
    });

return 'thành công'  }
}
