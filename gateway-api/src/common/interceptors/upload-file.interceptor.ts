import { BadRequestException } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { UploadValidatonOption } from '../interfaces/validationOption.interface';
import ValidationException from '../exceptions/validation.exception';

export function UploadFile(
  fileName: string,
  storage: any,
  options: UploadValidatonOption,
) {
  return class UploadUtility extends FileInterceptor(fileName, {
    storage,
    fileFilter(req, file, callback) {
      const ErrorMessages = [];
      if (options.required && !file) {
        ErrorMessages.push(`File ${fileName} is required.`);
      }

      // بررسی نوع MIME فایل
      if (file && !options.allowedMimeTypes.includes(file.mimetype)) {
        ErrorMessages.push(
          `Invalid file type for ${fileName}. Allowed types: ${options.allowedMimeTypes.join(', ')}`,
        );
      }

      // بررسی اندازه فایل
      if (file && file.size > options.maxFileSize) {
        ErrorMessages.push(
          `File size exceeds the maximum limit of ${options.maxFileSize / (1024 * 1024)} MB for ${fileName}.`,
        );
      }

      if (ErrorMessages.length > 0) {
        return callback(new ValidationException(ErrorMessages), false);
      }
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
      const ErrorMessages = [];
      const fieldName = file.fieldname;
      const fieldOptions = uploadFields.find(
        (field) => field.name === fieldName,
      );

      if (fieldOptions) {
        if (options.required && !file) {
          ErrorMessages.push('File ${fieldName} is required.');
        }
        if (!options.allowedMimeTypes.includes(file.mimetype)) {
          ErrorMessages.push(
            `Invalid file type for ${fieldName}. Allowed types: ${options.allowedMimeTypes.join(', ')}`,
          );
        }
        if (file.size > options.maxFileSize) {
          ErrorMessages.push(
            `File size exceeds the maximum limit of ${options.maxFileSize / (1024 * 1024)} MB for ${fieldName}.`,
          );
        }

        if (ErrorMessages.length) {
          return callback(new ValidationException(ErrorMessages), false);
        }
      }
      callback(null, true);
    },
  }) {};
}
