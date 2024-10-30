import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
@Catch(Error, RpcException)
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error | RpcException, host: ArgumentsHost): Observable<any> {
    if (exception instanceof RpcException)
      return throwError(() => exception.getError());

    if (exception instanceof Error) {
      return throwError(() => ({
        message: exception.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      }));
    }
  }
}
