import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Services } from 'src/common/enums/service.enum';
import { ProductAdminPatterns } from '../enums/AdminPatterns.enum';
import { catchError, lastValueFrom } from 'rxjs';
import { CreateProductDto } from '../dtos/product.dto';

import { ContentType } from 'src/common/enums/swagger.enum';
import { ProductImageStorage } from 'src/common/helper/multer/product.multer';
import { UploadMultiFiles } from 'src/common/decorators/upload-file.decorator';

@ApiTags('Product(AdminPanel)')
@Controller('admin/product')
export class ProductController {
  constructor(
    @Inject(Services.Product)
    private readonly productClientService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'create new product' })
  @HttpCode(HttpStatus.CREATED)
  @UploadMultiFiles(
    [
      { name: 'coverImage', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ],
    {
      allowedMimeTypes: ['image/png', 'image/jpeg'],
      maxFileSize: 2 * 1024 * 1024,
    },
    ProductImageStorage,
  )
  @ApiConsumes(ContentType.Multipart)
  @Post('create')
  async create(
    @Body() productDto: CreateProductDto,
    @UploadedFiles()
    files,
  ) {
    let response = await lastValueFrom(
      this.productClientService
        .send(ProductAdminPatterns.Create, {
          ...productDto,
          images: files?.images,
          coverImage: files?.coverImage[0],
        })
        .pipe(
          catchError((err) => {
            throw new HttpException(err.message, err.statusCode);
          }),
        ),
    );

    return response;
  }
}
