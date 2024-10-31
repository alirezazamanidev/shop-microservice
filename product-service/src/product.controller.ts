import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductPatterns } from './common/enums/product-Patterns';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @MessagePattern(ProductPatterns.Create)
  create(@Payload() productDto:CreateProductDto) {
    
    
    // return productDto
    return  this.productService.create(productDto)
  }
}
