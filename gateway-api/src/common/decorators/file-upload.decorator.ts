import { applyDecorators, UseInterceptors } from '@nestjs/common';

import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { join } from 'path';
import { UploadFile } from '../interceptors/upload-file.interceptor';
import { ProductImageStorage } from '../utils/multer/product.multer';

export const UploadSingleFile = (filename: string) =>
  applyDecorators(
    FormDataRequest({
      storage: FileSystemStoredFile,
    }),
    UseInterceptors(
      
      UploadFile(filename, ProductImageStorage),
    ),
  );

// export const UploadMultiFiles = (uploadFilds: MulterField[]) =>
//   applyDecorators(UseInterceptors(UploadFileFieldsS3(uploadFilds)));
