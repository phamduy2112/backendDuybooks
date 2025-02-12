import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('product')
export class ProductController {
    constructor(
        @Inject("PRODUCT_SERVICE") private productService:ClientProxy,
    ){}
    @Get("/get-all-product")
    async getAllProduct(){
        const responsive=await this.productService.send("get-product",'')
        return responsive
    }
    
}
 

