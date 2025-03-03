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
try {
  return this.productService.createBlog(data)
} catch (error) {
  console.log(error);
  
};
  
}

@MessagePattern('get-post')
async getPost(data){
  const {user_id,visibility}=data
return this.productService.getPostsByVisibility(user_id,visibility)
}

@MessagePattern('update-post')
async updateBlog(data) {
  return this.productService.updateBlog(data);
}

@MessagePattern('delete-post')
async deleteBlog(data) {
  return this.productService.deleteBlog(data);
}

@MessagePattern('get-save-post')
async getSaveBlog(data) {
  return this.productService.getSavePostByIdUser(data);
}

@MessagePattern('create-save-post')
async savePost(data) {
  return this.productService.savePost(data);
}

@MessagePattern('delete-save-post')
async deleteSavePost(data){
return this.productService.deleteSavePost(data);
}

}
