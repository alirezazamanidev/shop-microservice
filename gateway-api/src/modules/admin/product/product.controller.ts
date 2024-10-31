import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Services } from 'src/common/enums/service.enum';
import { ProductAdminPatterns } from '../enums/AdminPatterns.enum';
import { catchError, lastValueFrom, retry } from 'rxjs';
import { CreateProductDto } from '../dtos/product.dto';
import {
  FileSystemStoredFile,
  FormDataRequest,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { join } from 'path';
import { ContentType } from 'src/common/enums/swagger.enum';
import { memoryStorage } from 'multer';
import { UploadSingleFile } from 'src/common/decorators/file-upload.decorator';

@ApiTags('Product(AdminPanel)')
@Controller('admin/product')
export class ProductController {
  constructor(
    @Inject(Services.Product)
    private readonly productClientService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'create new product' })
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes(ContentType.Multipart)
  @FormDataRequest({storage:FileSystemStoredFile})
  @Post('create')
  async create(@Body() productDto: CreateProductDto) {
  
    let response = await lastValueFrom(
      this.productClientService
        .send(ProductAdminPatterns.Create, productDto)
        .pipe(
          catchError((err) => {
            throw new HttpException(err.message, err.statusCode);
          }),
        ),
    );

    return response;
  }
}
