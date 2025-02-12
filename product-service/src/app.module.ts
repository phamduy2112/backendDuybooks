import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './product/product.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductService } from './product/product.service';
import { ReactionsModule } from './reactions/reactions.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [PrismaModule, ReactionsModule, CommentModule],
  controllers: [AppController, ProductController],
  providers: [AppService, PrismaService, ProductService],
})
export class AppModule {}
