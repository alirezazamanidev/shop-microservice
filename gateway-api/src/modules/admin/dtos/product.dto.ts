import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dexcription: string;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  count: number;
  @ApiProperty()
  @IsNumberString()
  discount: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  price: number;
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @MaxFileSize(2 * 1024 * 1024, { each: true })
  @HasMimeType(['image/png', 'image/jpeg'], { each: true })
  @IsFiles({ each: true })
  images: FileSystemStoredFile[];
  @ApiProperty({ type: 'string', format: 'binary' })
  @MaxFileSize(2 * 1024 * 1024)
  @HasMimeType(['image/png', 'image/jpeg'])
  @IsFile()
  coverImage: FileSystemStoredFile;
}
