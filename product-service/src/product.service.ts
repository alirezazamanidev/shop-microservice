import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductFileEntity } from './entities/product-file.entity';

import { CreateProductDto } from './dtos/create-product.dto';
// import { S3Service } from './config/uploadFile-s3.config';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductFileEntity)
    private productFileRepostory: Repository<ProductFileEntity>,
    // private readonly s3Service:S3Service
  ) {}


  async create(peoductDto:CreateProductDto){
    let {coverImage}=peoductDto
   
  
    // await this.s3Service.uploadFile(coverImage,'product/images');
    return 'ok'
  }
}
