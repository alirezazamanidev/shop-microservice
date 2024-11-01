import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Services } from 'src/common/enums/service.enum';
import { ProductAdminPatterns } from '../enums/AdminPatterns.enum';
import { catchError, lastValueFrom } from 'rxjs';
import { CreateProductDto } from '../dtos/product.dto';

import { ContentType } from 'src/common/enums/swagger.enum';
import { UploadFileFields } from 'src/common/interceptors/upload-file.interceptor';
import { ProductImageStorage } from 'src/common/helper/multer/product.multer';
import { UploadMultiFiles } from 'src/common/decorators/upload-file.decorator';
import { MultiFileValidationPipe } from 'src/common/pipes/multi-file.validation.pipe';

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
    ProductImageStorage,
  )
  @ApiConsumes(ContentType.Multipart)
  @Post('create')
  async create(
    @Body() productDto: CreateProductDto,
    @UploadedFiles(
    
        new MultiFileValidationPipe({
          fields:{
            coverImage:{
              allowedTypes:['image/png'],
              maxSize:1024*1024*2,
              maxCount:1
            },
            images:{
              allowedTypes:['image/png'],
              maxSize:1024*1024*2,
              maxCount:10
            }
          }
          
        })
      
      
    )
    files,
  ) {
    return files;
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
