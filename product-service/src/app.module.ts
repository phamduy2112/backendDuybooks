import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './product/product.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductService } from './product/product.service';
import { ReactionsModule } from './reactions/reactions.module';
import { CommentModule } from './comment/comment.module';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';

@Module({
  imports: [PrismaModule, ReactionsModule, CommentModule],
  controllers: [AppController, ProductController, ImageController],
  providers: [AppService, PrismaService, ProductService, ImageService],
})
export class AppModule {}
