import { diskStorage } from 'multer';
import { getDirFile } from '.';
import { mkdirSync } from 'fs';
import { extname } from 'path';

export const ProductImageStorage = diskStorage({
  destination(req, file, callback) {
    const dir = getDirFile('photos', 'product');
    mkdirSync(dir, { recursive: true });
    callback(null, dir);
  },
  filename(req, file, callback) {
    let format = extname(file.originalname);
    let filename = new Date().getTime().toString() + format;
    callback(null, filename);
  },
});
