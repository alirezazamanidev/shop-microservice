import { diskStorage } from 'multer';

import { mkdirSync } from 'fs';
import { extname } from 'path';
import { getDirFile } from 'src/common/utils/functions.utils';

export const ProductImageStorage = diskStorage({
  destination(req, file, callback) {
    try {
      const dir = getDirFile('photos', 'product');
   
    mkdirSync(dir, { recursive: true });
    callback(null, dir);
    } catch (error) {
      console.log(error);
      
    }
  },
  filename(req, file, callback) {
    let format = extname(file.originalname);
    let filename = new Date().getTime().toString() + format;
    callback(null, filename);
  },
  
});
