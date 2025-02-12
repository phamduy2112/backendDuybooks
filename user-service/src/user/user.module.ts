import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule], // Đảm bảo module này được import
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
