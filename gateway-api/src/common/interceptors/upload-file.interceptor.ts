import { BadRequestException } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { UploadValidatonOption } from '../interfaces/validationOption.interface';


export function UploadFile(fileName: string, storage: any,options:UploadValidatonOption) {
  return class UploadUtility extends FileInterceptor(fileName, {
    storage,
    fileFilter(req, file, callback) {
      
         // بررسی اینکه آیا فایل الزامی است و آیا وجود دارد
         if (options.required && !file) {
          return callback(new BadRequestException(`File ${fileName} is required.`), false);
        }
  
        // بررسی نوع MIME فایل
        if (!options.allowedMimeTypes.includes(file.mimetype)) {
          return callback(new BadRequestException(`Invalid file type for ${fileName}. Allowed types: ${options.allowedMimeTypes.join(', ')}`), false);
        }
  
        // بررسی اندازه فایل
        if (file.size > options.maxFileSize) {
          return callback(new BadRequestException(`File size exceeds the maximum limit of ${options.maxFileSize / (1024 * 1024)} MB for ${fileName}.`), false);
        }
  
        callback(null, true);
    },

    
  }) {};
}
export function UploadFileFields(
  uploadFields: MulterField[],
  storage: any,
  options: UploadValidatonOption,
) {
  return class UploadUtility extends FileFieldsInterceptor(uploadFields, {
    storage,
    fileFilter(req, file, callback) {
      const fieldName = file.fieldname;
      const fieldOptions = uploadFields.find(
        (field) => field.name === fieldName,
      );

      if (fieldOptions) {
        if (options.required && !file) {
          return callback(
            new BadRequestException(`File ${fieldName} is required.`),
            false,
          );
        }
        if (!options.allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Invalid file type for ${fieldName}. Allowed types: ${options.allowedMimeTypes.join(', ')}`,
            ),
            false,
          );
        }
        if (file.size > options.maxFileSize) {
          return callback(
            new BadRequestException(
              `File size exceeds the maximum limit of ${options.maxFileSize / (1024 * 1024)} MB for ${fieldName}.`,
            ),
            false,
          );
        }
      }
      callback(null, true);
    },
  }) {};
}
