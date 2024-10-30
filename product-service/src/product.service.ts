import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductFileEntity } from './entities/product-file.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductFileEntity)
    private productFileRepostory: Repository<ProductFileEntity>,
  ) {}


  async create(){
    const product=await this.productRepository.find({});
    return product;
  }
}
