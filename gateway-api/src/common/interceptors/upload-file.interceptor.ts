import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
export function UploadFile(filedName: string,storage:any) {
  return class UploadUtility extends FileInterceptor(filedName, {
    storage
  }) {};
}
export function UploadFileFields(uploadFields: MulterField[],storage:any) {
  return class UploadUtility extends FileFieldsInterceptor(uploadFields,{
    storage,

  
  }) {};
}
