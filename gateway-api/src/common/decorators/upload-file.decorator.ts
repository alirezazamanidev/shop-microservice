import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  UploadFile,
  UploadFileFields,
} from '../interceptors/upload-file.interceptor';
import { FileCleanupInterceptor } from '../interceptors/FileCleanup.interceptor';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileInterceptor } from '@nestjs/platform-express';

export const UploadSingleFile = (fieldname: string, storage: any) =>
  applyDecorators(
    UseInterceptors(UploadFile(fieldname, storage), FileCleanupInterceptor),
  );

export const UploadMultiFiles = (fieldsname: MulterField[], storage: any) =>
  applyDecorators(
    UseInterceptors(
      UploadFileFields(fieldsname, storage),
      FileCleanupInterceptor,
    ),
  );
