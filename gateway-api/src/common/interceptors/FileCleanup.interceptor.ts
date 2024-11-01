import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { unlinkSync } from 'fs';
import { Request } from 'express';

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      catchError((error) => {
        // پاک کردن فایل‌ها در صورت بروز خطا
        if (request.files) {
          const files = request.files as {
            [fieldname: string]: Express.Multer.File[];
          };
          Object.keys(files).forEach((field) => {
            files[field].forEach((file) => {
              try {
                unlinkSync(file.path);
              } catch (err) {
                console.error('Error while deleting file:', err);
              }
            });
          });
        }
        if (request.file) {
          try {
            unlinkSync(request.file.path);
          } catch (error) {
            console.error('Error while deleting file:', error);
          }
        }
        throw new InternalServerErrorException(error.message);
      }),
    );
  }
}
