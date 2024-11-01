import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface FieldValidationOptions {
  allowedTypes?: string[];
  maxSize?: number;
  maxCount?: number;
}

interface ValidationOptions {
  fields: {
    [field: string]: FieldValidationOptions;
  };
}

@Injectable()
export class MultiFileValidationPipe implements PipeTransform {
  constructor(private readonly options: ValidationOptions) {}

  transform(files: any) {
    for (const field in this.options.fields) {
      const fieldOptions = this.options.fields[field];
      const uploadedFiles = files[field] || [];

      if (fieldOptions.maxCount && uploadedFiles.length > fieldOptions.maxCount) {
        throw new BadRequestException({
          message: `Exceeded maximum file count for ${field}. Maximum allowed is ${fieldOptions.maxCount}.`,
          field,
          statusCode: 400,
        });
      }

      uploadedFiles.forEach((file) => {
        if (fieldOptions.allowedTypes && !fieldOptions.allowedTypes.includes(file.mimetype)) {
            console.log('ok');
            
          throw new BadRequestException({
            message: `Invalid file type for ${field}. Allowed types are: ${fieldOptions.allowedTypes.join(', ')}.`,
            field,
            statusCode: 400,
          });
        }

        if (fieldOptions.maxSize && file.size > fieldOptions.maxSize) {
          throw new BadRequestException({
            message: `File size for ${field} exceeds limit. Maximum size is ${fieldOptions.maxSize / (1024 * 1024)} MB.`,
            field,
            statusCode: 400,
          });
        }
      });
    }

    return files;
  }
}
