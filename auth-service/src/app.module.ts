import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    
    JwtModule.register({
      secret:"Bi_MAT", // Get the secret from environment variables
      signOptions: { expiresIn: '1d' }, // Optional: set token expiration
    }),
     PrismaModule,
     AuthModule,
     MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure:true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user:'duyp7484@gmail.com',
            pass: 'yycxoaqywrvhtvsh',
          },
          tls: {
            rejectUnauthorized: false, // 👈 Thêm dòng này để bỏ qua lỗi SSL
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        preview: true,
        // template: {
        //   dir: process.cwd() + '/template/',
        //   adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
   
    }),
    ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
