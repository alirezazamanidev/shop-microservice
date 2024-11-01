import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  UploadFile,
  UploadFileFields,
} from '../interceptors/upload-file.interceptor';
import { FileCleanupInterceptor } from '../interceptors/FileCleanup.interceptor';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { UploadValidatonOption } from '../interfaces/validationOption.interface';
export const UploadSingleFile = (fieldname: string,options:UploadValidatonOption, storage: any) =>
  applyDecorators(
    UseInterceptors(UploadFile(fieldname, storage,options)),
  );

export const UploadMultiFiles = (fieldsname: MulterField[],options:UploadValidatonOption, storage: any) =>
  applyDecorators(
    UseInterceptors(
      UploadFileFields(fieldsname, storage,options),
      
    ),
  );
