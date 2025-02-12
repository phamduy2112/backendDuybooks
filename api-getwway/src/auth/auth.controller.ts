import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
    constructor(
 @Inject("AUTH_SERVICE") private authService:ClientProxy
    ){}
  

        @Post("/register")
        async register(@Body() payload){
            const register=await lastValueFrom(this.authService.send("register-user",payload))
            return register
        }
        @Post("/login")
        async login(@Body() payload){
            const register=await lastValueFrom(this.authService.send("login-user",payload))
            return register
        }
        @Get('/confirm-email')
        async confirmEmail(@Query("token") token: string) {
            console.log(token);
            const payloadData={
                'token':token
            }
            
            const confirmEmail=await lastValueFrom(this.authService.send("change-status-email",payloadData))
            return confirmEmail
        }

        @Post("/verify-email") // Sửa chính tả từ "verfity-email" thành "verify-email"
       async verifyEmail(@Body() payload){
        const verifyEmail=await lastValueFrom(this.authService.send("verify-email",payload))
        return verifyEmail
       }
       @Post('/verify-otp')
       async verifyOTP(@Body() payload){
        const verifyOTP=await lastValueFrom(this.authService.send("verfity-otp",payload))
        return verifyOTP
       }
       @Post('/change-password-no-token')
       async changePasswordWithOutToken(@Body() payload){
        const changePassword=await lastValueFrom(this.authService.send("Change-password-no-token",payload))
        return changePassword
       }
    }
      

