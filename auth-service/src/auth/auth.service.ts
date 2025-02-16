import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { responseSend } from 'src/model/response';
import { IPayloadChangePassword, IPayloadLogin, IPayLoadRegister, TPayloadUser } from 'src/types/auth.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private emailService:MailerService , // Inject EmailService
  ) {}

private generateRandomString(length:any){
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

private async verifyOtp(inputCode: string) {
  try {
    // Lấy mã OTP từ cơ sở dữ liệu
    const otpRecord = await this.prismaService.code.findFirst({
      where: { code: inputCode },
    });

    if (!otpRecord) {
      return responseSend('', "Mã OTP không hợp lệ hoặc đã hết hạn", 400);
    }

    // Kiểm tra xem mã OTP có hết hạn không (3 phút)
    const now = new Date();
    const otpCreatedAt = otpRecord.created_at;
    const expiryTime = new Date(otpCreatedAt);
    expiryTime.setMinutes(expiryTime.getMinutes() + 3); // Hết hạn sau 3 phút

    if (now > expiryTime) {
      // Nếu mã OTP đã hết hạn, xóa mã OTP khỏi cơ sở dữ liệu
      await this.prismaService.code.delete({
  where: { id: otpRecord.id },
      });

      return responseSend('', "Mã OTP đã hết hạn", 400);
    }

    // Kiểm tra mã OTP nhập vào có đúng không
    if (inputCode !== otpRecord.code) {
      return responseSend('', "Mã OTP không đúng", 400);
    }

    // Xóa mã OTP sau khi xác thực thành công
    await this.prismaService.code.delete({
      where: { id: otpRecord.id },

    });

    return responseSend('', 'Thành công', 200);
  } catch (error) {
    console.error(error);
    return responseSend('', 'Đã xảy ra lỗi', 500);
  }
}
  private async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw new Error("Failed to hash password");
    }
  }

  private async generaToken(payload: any) {
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
  private async checkStatusUser(){

  }
  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      if (!decoded) {
        throw new Error('Token không hợp lệ');
      }
      return decoded;
    } catch (error) {
      throw new Error('Token không hợp lệ');
    }
  }
  async loginUser(TDataLogin:IPayloadLogin){
    try {
      const user=await this.prismaService.users.findFirst({
        where:{
          email:TDataLogin.email,
        }
      })
      if(!user) return responseSend('', "Không tồn tại email hoặc password", 400);
      const isCheckPassword=await bcrypt.compare(TDataLogin.password,user.password);
      if(!isCheckPassword) return responseSend('', "Không tồn tại email hoặc password", 400);
      if(user.status=="inactive"){ 
        const sendEmailToUser=await this.sendVerificationEmail(user.email,user.id)
        return responseSend("","Bạn cần xác nhận tài khoản thông qua email",400)};
      const token= await this.generaToken({id:user.id,email:user.email,role:user.role});
    
      
      return responseSend({
       
        ...token,
        

      }, 'Thành công', 200);
 
    } catch (error) {
      
    }
  }

  async registerUser(TRegisterUser: IPayLoadRegister) {
    try {
      const hashPassword = await this.hashPassword(TRegisterUser.password);
      const existingUser = await this.prismaService.users.findFirst({
        where: {
          email: TRegisterUser.email,
        }
      });

      if (existingUser) {
        return responseSend('', "Trùng email", 400);
      }

      const addUser = await this.prismaService.users.create({
        data: {
          ...TRegisterUser,
          password: hashPassword,
          role: 'user',
          status: 'inactive',
        },
      });

      // Send confirmation email
      const sendEmailToUser=await this.sendVerificationEmail(addUser.email,addUser.id)
      return responseSend("","Bạn cần xác nhận tài khoản thông qua email",200)
    } catch (e) {
      console.log(e);
      
      return e;
    }
  };
  async  sendVerificationEmail  (userEmail:string, userId:number)  {
    try {
      const token= await this.generaToken({id:userId});

      // Tạo token xác thực với userId
      const confirmationLink = `http://localhost:8000/auth/confirm-email?token=${token.access_token}`;
      const sendEmail= this.emailService
      .sendMail({
        to: userEmail, // list of receivers
        subject: 'Xác nhận tài khoản', // Subject line
        html: `
          <h1>Xác nhận tài khoản tài khoản của bạn</h1>
    <p>Chào bạn,</p>
      <a href=${confirmationLink}>Kích hoạt tài khoản</a>  `, // HTML body content
      })

    if(sendEmail){

    }
    } catch (error) {
      console.error("Lỗi khi gửi email xác thực:", error);
    }
  };
  async checkEmailStatus(payload: { token: string }) {
    try {
      const { token } = payload;
      console.log(token);
      
      // Xác minh token
      const decoded =await this.verifyToken(token);
    
      
      if (!decoded || !decoded.id) {
        return {
          status: 400,
          message: "Token xác thực không hợp lệ hoặc đã hết hạn.",
        };
      }
  
      // Cập nhật trạng thái của người dùng trong DB
      const updateStatusUser = await this.prismaService.users.update({
        data: { status: "active" },
        where: { id: decoded.id },
      });
  
      return {
        status: 200,
        message: "Thành công",
        data: '',
      };
    } catch (error) {
      console.error("Lỗi xác thực email:", error);
      return {
        status: 500,
        message: "Có lỗi xảy ra khi xác thực email.",
      };
    }
  }
  async getAllUser() {
    return 'Thành công 1';
  }

  async verificationEmail(payload:{email:string}) {
    try {
      const {email}=payload
        const checkEmail = await this.prismaService.users.findUnique({ where: { email: email } });
        
        // Kiểm tra xem email có tồn tại không
        if (!checkEmail) {
            return responseSend('', "Không tồn tại email", 400); 
        }

        const code = this.generateRandomString(6);
        this.emailService
        .sendMail({
          to: email, // list of receivers
          subject: 'Nhập mã OTP', // Subject line
          html: `
            <h1>Nhập mã otp tài khoản của bạn</h1>
      <p>Chào bạn,</p>
        <b>Mã otp: ${code}</b>  `, // HTML body content
        })
        await this.prismaService.code.create({
          data:{
            user_id:checkEmail.id,
            code
          }
        })
        return responseSend(checkEmail, 'Thành công', 200);
    } catch (error) {
        console.error('Lỗi trong verificationEmail:', error);
        return responseSend('', 'Đã xảy ra lỗi, vui lòng thử lại sau', 500);
    }
}


  async verifyCheckOTP(payload:{code:string}){
 try {
  const {code}=payload
  return this.verifyOtp(code);
 } catch (error) {
  console.log(error);
  
 }


  }
  // đổi password ở auth
  async changePasswordWithoutToken(payload:IPayloadChangePassword){
    try {
      const {email,newPassword}=payload
      const checkEmail = await this.prismaService.users.findFirst({
        where: { email },
      });
  
      if (!checkEmail) {
        return responseSend( "", "Email không tồn tại", 404);
      }
  
      // Hash the new password using bcrypt
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
       // Cập nhật mật khẩu trong cơ sở dữ liệu
       await this.prismaService.users.update({
        where: { id: checkEmail.id },
        data: { password: hashedPassword },
      });
  
      // Return success response
      return responseSend( true, "Mật khẩu đã được cập nhật", 200);
    } catch (error) {
      
    }
  }

}
