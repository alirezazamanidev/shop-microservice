import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductPatterns } from './common/enums/product-Patterns';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @MessagePattern(ProductPatterns.Create)
  test(@Payload() data: any) {
    return data;
  }
}
