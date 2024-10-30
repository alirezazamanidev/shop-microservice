import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

type Option = {
  message: string;
  statusCode: HttpStatus;
};
export class RpcExceptionError extends RpcException {
  constructor(public option: Option) {
    let { message, statusCode } = option;
    super({
      message,
      statusCode,
    });
  }
}
