import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [  
        JwtModule.register({
            secret: "Bi_MAT", // Get the secret from environment variables
            signOptions: { expiresIn: '1d' }, // Optional: set token expiration
        }),
        PrismaModule
    ],
    controllers: [AuthController],
    providers: [AuthService], // Add EmailService to providers
})
export class AuthModule {}
