import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { Services } from 'src/common/enums/service.enum';
import { ConfigService } from 'src/configs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ProductController } from './product/product.controller';

@Module({
  imports: [],
  controllers: [AdminController, ProductController],
  providers: [
    ConfigService,
    {
      provide: Services.Product,
      useFactory(configService: ConfigService) {
        const productServiceOptions = configService.get('productService');
        return ClientProxyFactory.create(productServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AdminModule {}
