import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormDbConfig } from './config/typeOrm-config';
import { ProductEntity } from './entities/product.entity';
import { ProductFileEntity } from './entities/product-file.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
@Module({
  imports: [

    TypeOrmModule.forRootAsync({
      useClass: TypeormDbConfig,
      inject: [TypeormDbConfig],
    }),
    TypeOrmModule.forFeature([ProductEntity,ProductFileEntity])
  ],
  controllers:[ProductController],
  providers: [TypeormDbConfig,ProductService],
})
export class ProductModule {}
