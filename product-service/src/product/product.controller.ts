import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService:ProductService,
  ) {}

  // Blog
  @MessagePattern('get-product')

   async getAllProduct() {
    try {
      return 'Thành công';
    } catch (error) {
      return error;
    }

  }

  @MessagePattern('create-post')
  async createProduct(data) {
return this.productService.createBlog(data);
  
}

@MessagePattern('get-post')
async getPost(data){
return this.productService.getPostsByVisibility(1,'duy')
}

@MessagePattern('update-blog')
async updateBlog(data) {
  return this.productService.updateBlog(data);
}

@MessagePattern('detele-blog')
async deleteBlog(data) {
  return this.productService.deleteBlog(data);
}

@MessagePattern('get-save-blog')
async getSaveBlog(data) {
  return this.productService.getSavePostByIdUser(data);
}

@MessagePattern('save-post')
async savePost(data) {
  return this.productService.savePost(data);
}

@MessagePattern('delete-post')
async deleteSavePost(data){
return this.productService.deleteSavePost(data);
}

}
