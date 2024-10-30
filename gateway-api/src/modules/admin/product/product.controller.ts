import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Services } from 'src/common/enums/service.enum';
import { ProductAdminPatterns } from '../enums/AdminPatterns.enum';
import { catchError, lastValueFrom } from 'rxjs';

@ApiTags('Product(AdminPanel)')
@Controller('admin/product')
export class ProductController {
  constructor(
    @Inject(Services.Product)
    private readonly productClientService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'create new product' })
  @HttpCode(HttpStatus.CREATED)
  @Get('test')
  async create() {
    let response = await lastValueFrom(
      this.productClientService.send(ProductAdminPatterns.Create, { msg: 'hello alireza' }).pipe(
        catchError((err) => {
          throw new HttpException(err.message, err.statusCode);
        }),
      ),
    );

    return response;
  }
}
