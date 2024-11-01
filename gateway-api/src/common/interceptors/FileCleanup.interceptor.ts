import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { unlink, access, constants } from 'fs/promises';
import { Request } from 'express';
import ValidationException from '../exceptions/validation.exception';

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      catchError(async (error) => {
        await this.cleanupFiles(request);
        throw error;
      }),
    );
  }

  private async cleanupFiles(request: Request) {
    if (request.files) {
      const files = request.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      await Promise.all(
        Object.keys(files).flatMap((field) =>
          files[field].map((file) => this.checkAndDeleteFile(file.path)),
        ),
      );
    }

    if (request.file) {
      await this.checkAndDeleteFile(request.file.path);
    }
  }

  private async checkAndDeleteFile(path: string) {
    try {
      await access(path, constants.F_OK); // چک کردن وجود فایل
      await unlink(path); // حذف فایل اگر وجود دارد
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error while deleting file:', error); // فقط اگر خطا غیر از نبود فایل بود، لاگ شود
      }
    }
  }
}
