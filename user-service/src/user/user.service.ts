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
  
   async createOTPPin(DataCreateOTPPin)
   {
    const {id,otpPin}=DataCreateOTPPin

    const createOTP=await this.prismaService.users.update({
      data:{
        otp_pin:otpPin
      },
      where:{
        id
      }
    })
    return responseSend(createOTP, "Thành công", 200);
  }
  private async checkOTPPin(id, otpPin) {
    let numError = 0;
  
    // Lấy thông tin người dùng trước
    const userDetail = await this.prismaService.users.findFirst({
      where: { id }
    });
  
    // Kiểm tra nếu người dùng không tồn tại
    if (!userDetail) {
      return responseSend('', "Người dùng không tồn tại", 400);
    }
  
    // Kiểm tra nếu tài khoản chưa có mã OTP
    if (!userDetail.otp_pin) {
      return responseSend('', "Tài khoản của bạn chưa có mã OTP. Vui lòng tạo mã OTP trước.", 400);
    }
  
    // Nếu mã OTP rỗng từ request
    if (!otpPin) {
      return responseSend('', "Vui lòng nhập mã OTP", 400);
    }
  
    // Xác thực OTP
    if (userDetail.otp_pin !== otpPin) {
      numError++;
      return responseSend('', "Mã OTP không đúng", 400);
    }
  
    if (numError === 5) {
      return responseSend('', "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 5 phút.", 400);
    }
  
    return responseSend('', "Xác thực OTP thành công", 200);
  }
  
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

  async update(id: number, updateUserDto: any, otpPin?: string) {
    // Kiểm tra nếu đang cập nhật email hoặc mật khẩu
    if (updateUserDto.email || updateUserDto.password) {
      this.checkOTPPin(id,otpPin);
    }
  
    // Thực hiện cập nhật thông tin người dùng
    await this.prismaService.users.update({
      where: { id: id },
      data: updateUserDto,
    });
  
    const updatedUser = await this.prismaService.users.findFirst({
      where: { id: id }
    });
  
    return responseSend(updatedUser, "Cập nhật người dùng thành công!", 200);
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
