import { Test } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductFileEntity } from './entities/product-file.entity';
import { DataSource } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import slugify from 'slugify';
import { access, constants, unlink } from 'fs/promises';
import { RpcExceptionError } from './common/exceptions/Rpc.exception';
jest.mock('slugify');
const mockSlugify = slugify as unknown as jest.Mock;

jest.mock('fs/promises', () => ({
  access: jest.fn(),
  unlink: jest.fn(),
}));

describe('ProductService', () => {
  let service: ProductService;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
  const mockDataSource = {
    transaction: jest.fn().mockImplementation((fn) => {
      const manager = {
        create: jest.fn(),
        save: jest.fn(),
      };
      return fn(manager);
    }),
  };
  const mockProductFileRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductFileEntity),
          useValue: mockProductFileRepository,
        },
      ],
    }).compile();
    service = moduleRef.get<ProductService>(ProductService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create', () => {
    const createProductDto: CreateProductDto = {
      title: 'test_slug',
      description: 'test_description',
      count: 10,
      discount: 5,
      price: 3000,
      coverImage: {
        size: 3000,
        originalname: 'cover.png',
        fieldname: 'coverImage',
        path: 'image_path',
        mimetype: 'image/png',
      } as Express.Multer.File,
      images: [
        {
          size: 3000,
          originalname: 'cover.png',
          fieldname: 'coverImage',
          path: 'image_path',
          mimetype: 'image/png',
        },
      ] as Express.Multer.File[],
    };

    it('should create the product successfully', async () => {
      const slug = 'test_slug';

      mockProductRepository.findOne.mockResolvedValue(null);

      mockSlugify.mockReturnValue(slug);
      mockDataSource.transaction.mockImplementation(async (fn) => {
        const manager = {
          create: jest
            .fn()
            .mockReturnValue({ id: 1, slug, ...createProductDto }),
          save: jest
            .fn()
            .mockResolvedValue({ id: 1, slug, ...createProductDto }), // Ensure the product has an id
        };
        return fn(manager);
      });
      const result = await service.create(createProductDto);

      expect(result).toHaveProperty('product_id');
      expect(slugify).toHaveBeenCalledWith(createProductDto.title, {
        replacement: '_',
        trim: true,
        lower: true,
      });
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { slug },
        select: { id: true, slug: true },
      });
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  });

  describe('Remove', () => {
    const mockProduct = {
      id: 1,
      images: [{ id: 1, path: 'path/to/image1.jpg' }],
      coverImage: { id: 2, path: 'path/to/cover.jpg' },
    };
    it('should successfully remove a product and its images', async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(mockProduct);
      mockProductRepository.remove.mockResolvedValueOnce(undefined);
   
      (unlink as jest.Mock).mockResolvedValue(undefined);
      const result = await service.remove(mockProduct.id);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: { images: true, coverImage: true },
        select: {
          id: true,
          images: { id: true, path: true },
          coverImage: { id: true, path: true },
        },
      });
     
      expect(unlink).toHaveBeenCalledWith('path/to/image1.jpg');
      expect(unlink).toHaveBeenCalledWith('path/to/cover.jpg');
      expect(mockProductRepository.remove).toHaveBeenCalledWith(mockProduct);
      expect(result).toHaveProperty('message');
    });

    it('should log error if image file does not exist and continue deleting other files', async () => {
      const product = {
        id: 1,
        images: [{ id: 1, path: 'path/to/nonexistent.jpg' }],
        coverImage: { id: 2, path: 'path/to/cover.jpg' },
      };

      mockProductRepository.findOne.mockResolvedValueOnce(product);
      (access as jest.Mock)
        .mockRejectedValueOnce(new Error('ENOENT')) // simulate file not existing for image
        .mockResolvedValueOnce(undefined); // coverImage exists
      (unlink as jest.Mock).mockResolvedValue(undefined);

      const result = await service.remove(product.id);

      expect(unlink).toHaveBeenCalledWith('path/to/cover.jpg');
      expect(mockProductRepository.remove).toHaveBeenCalledWith(product);
      expect(result).toEqual({ message: 'محصول با موفقیت حذف شد!' });
    });
    it('should throw an error if product is not found', async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(RpcExceptionError);
    });
  });
});
