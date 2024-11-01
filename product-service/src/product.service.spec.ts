import { Test } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductFileEntity } from './entities/product-file.entity';
import { DataSource } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import slugify from 'slugify';
jest.mock('slugify');
const mockSlugify = slugify as unknown as jest.Mock;

describe('ProductService', () => {
  let service: ProductService;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
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
});
