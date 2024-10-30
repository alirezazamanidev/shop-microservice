import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Services } from 'src/common/enums/service.enum';
import { CheckOtpDto, SendOtpDto } from './dtos/auth.dto';
import { catchError, lastValueFrom } from 'rxjs';
import { AuthPatterns } from './enums/auth-patterns';
import { ContentType } from 'src/common/enums/swagger.enum';
import { Auth } from './decorators/auth.decorator';
import { Request } from 'express';

@ApiTags()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(Services.User) private readonly authClientService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'send Otp ' })
  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  @ApiConsumes(ContentType.UrlEncoded, ContentType.Json)
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return await lastValueFrom(
      this.authClientService.send(AuthPatterns.SendOtp, sendOtpDto).pipe(
        catchError((err) => {
          throw new HttpException(err.message, err.statusCode);
        }),
      ),
    );
  }
  @ApiOperation({ summary: 'check Otp ' })
  @HttpCode(HttpStatus.OK)
  @Post('check-otp')
  @ApiConsumes(ContentType.UrlEncoded, ContentType.Json)
  async checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return await lastValueFrom(
      this.authClientService.send(AuthPatterns.CheckOtp, checkOtpDto).pipe(
        catchError((err) => {
          throw new HttpException(err.message, err.statusCode);
        }),
      ),
    );
  }

  @Auth()
  @ApiOperation({ summary: 'check login and get user payload' })
  @HttpCode(HttpStatus.OK)
  @Get('check-login')
  checkLogin(@Req() req: Request) {
    return req.user;
  }
}
