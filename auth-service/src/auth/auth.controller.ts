import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { log } from 'node:console';
import { JwtService } from '@nestjs/jwt';
import { IPayloadChangePassword, IPayloadLogin, IPayLoadRegister } from 'src/types/auth.interface';
import { AuthRegisterDto } from './dto/create-auth-service.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private primaService:PrismaService,
        private readonly authService:AuthService,
        private jwtService:JwtService
    ){}
    @MessagePattern("get-user")
    async getAllProduct() {
        try {
          return this.authService.getAllUser();

        } catch (error) {
          return error;
        }
      }

    @MessagePattern("register-user")
    async registerUser(payload:AuthRegisterDto){
        try{
            return this.authService.registerUser(payload);
        }catch(e){
            return e
        }
    }

    @MessagePattern('login-user')
    async loginUser(payload:IPayloadLogin){
      try{
        return this.authService.loginUser(payload);
    }catch(e){
        return e
    }
    }


    @MessagePattern('change-status-email')
    async checkEmailStatus(payload:{token:string}){
      try {
        return this.authService.checkEmailStatus(payload)
      } catch (error) {
        
      }
    }

    @MessagePattern('verify-email')
    async verfityEmail(payload:{email:string}){
        try {
          return this.authService.verificationEmail(payload)
        } catch (error) {
          console.log(error);
          
          return error
        }

      }
      @MessagePattern('verfity-otp')
      async verifyCheckOTP(payload:{code:string}){
        try { 
          return this.authService.verifyCheckOTP(payload)
        } catch (error) {
          return error
        }
      }
      
      @MessagePattern('Change-password-no-token')
      async changePasswordWithOutToken(payload:IPayloadChangePassword){
        try {
          return this.authService.changePasswordWithoutToken(payload)
        } catch (error) {
          console.log(error);
          
        }
      }
      @MessagePattern('verify-token')
      async handleVerifyToken(@Payload() payload: { authHeader: string }) {
        try {
          // Kiểm tra payload có authHeader không
          if (!payload?.authHeader) {
            throw new UnauthorizedException('Không tìm thấy authHeader.');
          }
    
          // Lấy token từ Header
          const token = payload.authHeader.split(' ')[1];
          if (!token) {
            throw new UnauthorizedException('Token không hợp lệ.');
          }
    
          // Xác thực token
          const decoded = await this.jwtService.verifyAsync(token);
          return decoded; // Trả về thông tin token nếu hợp lệ
        } catch (error) {
          throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.');
        }
      }
    }
