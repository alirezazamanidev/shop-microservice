
export class CreateProductDto {

  title: string;
  description: string;
  count: number;
  discount: number;
  price: number;
  images: Express.Multer.File[];
  coverImage: Express.Multer.File;
}
