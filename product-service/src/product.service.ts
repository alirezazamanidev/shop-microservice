import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { ProductFileEntity } from './entities/product-file.entity';

import { CreateProductDto } from './dtos/create-product.dto';
import { RpcExceptionError } from './common/exceptions/Rpc.exception';
import slugify from 'slugify';
import {  unlink } from 'fs/promises';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductFileEntity)
    private productFileRepostory: Repository<ProductFileEntity>,
    private readonly dataSourse: DataSource,
  ) {}

  async create(peoductDto: CreateProductDto) {
    let { coverImage, images, title, description, count, discount, price } =
      peoductDto;

    let createObject: DeepPartial<ProductEntity> = {
      title,
      description,
      count: count < 0 ? 0 : count,
      discount: discount < 0 ? 0 : discount,
      price: price < 0 ? 0 : price,
    };
    await this.checkExistBySlug(title);
    createObject['slug'] = slugify(title, {
      replacement: '_',
      trim: true,
      lower: true,
    });
    let newProduct = null;
    await this.dataSourse.transaction(async (manager) => {
      //! create product
      newProduct = manager.create(ProductEntity, createObject);
      newProduct = await manager.save(ProductEntity, newProduct);
      // created Images
      let imagesList: DeepPartial<ProductFileEntity>[] = [];
      images.forEach((image) => {
        imagesList.push({
          product: newProduct,
          size: image.size,
          originalname: image.originalname,
          fieldname: image.fieldname,
          path: image.path,
          mimetype: image.mimetype,
        });
      });
      let cover = manager.create(ProductFileEntity, {
        productId: newProduct.id,
        size: coverImage.size,
        originalname: coverImage.originalname,
        fieldname: coverImage.fieldname,
        path: coverImage.path,
        mimetype: coverImage.mimetype,
      });
      //save images
      cover = await manager.save(ProductFileEntity, cover);
      let photos = await manager.save(ProductFileEntity, imagesList);
      newProduct.coverImage = cover;
      newProduct.images = photos;
      newProduct = await manager.save(ProductEntity, newProduct);
    });
    return {
      message: 'product has been created!',
      product_id: newProduct.id,
    };
  }

  async remove(id: number) {
    const product = await this.getOneById(id);

    //? remove images
    for (const image of product.images) {
  
      unlink(image.path);
    }
  
    await unlink(product.coverImage.path);

    //remove product
    await this.productRepository.remove(product);
    return {
      message: 'محصول با موفقیت حذف شد!',
    };
  }
  async getOneById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        images: true,
        coverImage: true,
      },
      select: {
        id: true,
        images: {
          id: true,
          path: true,
        },
        coverImage: {
          id: true,
          path: true,
        },
      },
    });
    if (!product)
      throw new RpcExceptionError({
        message: 'محصول یافت نشد',
        statusCode: HttpStatus.NOT_FOUND,
      });
    return product;
  }
  async checkExistBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug },
      select: { id: true, slug: true },
    });
    if (product)
      throw new RpcExceptionError({
        message: 'product slug already has exist',
        statusCode: HttpStatus.CONFLICT,
      });
    return slug;
  }
}
