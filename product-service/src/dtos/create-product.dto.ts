
export class CreateProductDto {

  title: string;
  dexcription: string;
  count: number;
  discount: number;
  price: number;
  images: Express.Multer.File[];
  coverImage: Express.Multer.File;
}
