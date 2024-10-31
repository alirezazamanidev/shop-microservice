import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { SendOtpDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RpcExceptionError } from 'src/common/exceptions/Rpc.exception';

describe('AuthService', () => {
  let service: AuthService;

  let mockUser: Partial<UserEntity> = {
    id: 1,
    fullname: 'test',
    username: 'test',
    phone: '09914275883',
    isBlocked: false,
  };
  let mockOtp = {
    id: 1,
    userId: mockUser.id,
    code: '12345',
  } as OtpEntity;
  let mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };
  let mockOtpRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const moduleRef = Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(OtpEntity),
          useValue: mockOtpRepository,
        },
      ],
    }).compile();
    service = (await moduleRef).get<AuthService>(AuthService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('service should be defined!', () => {
    expect(service).toBeDefined();
  });

  describe('SendOtp', () => {
    let sendOtpDto: SendOtpDto = { phone: '09914275883' };
    it('should create user send otp if user does not existed!', async () => {
      // Arrange
      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockOtpRepository.findOneBy.mockResolvedValue(null);
      mockOtpRepository.create.mockReturnValue(mockOtp);
      mockOtpRepository.save.mockResolvedValue(mockOtp);
      // Act
      const result = await service.sendOtp(sendOtpDto);

      // Assert
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        phone: sendOtpDto.phone,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockOtpRepository.findOneBy).toHaveBeenLastCalledWith({
        userId: mockUser.id,
      });

      expect(mockOtpRepository.create).toHaveBeenCalledWith({
        code: expect.any(String),
        expiresIn: expect.any(Date),
        userId: mockUser.id,
      });
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        { id: mockUser.id },
        { otpId: mockOtp.id },
      );
      expect(result).toHaveProperty('code', mockOtp.code);
    });
    it('should throw a error if user is blocked!', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce({
        ...mockUser,
        isBlocked: true,
      });
      await expect(service.sendOtp(sendOtpDto)).rejects.toThrow(
        RpcExceptionError,
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        phone: sendOtpDto.phone,
      });
    });
    it('should throw error when not expired otp code', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockOtpRepository.findOneBy.mockResolvedValue({
        ...mockOtp,
        expiresIn: new Date(new Date().getTime() + 120 * 1000),
      });

      await expect(service.sendOtp(sendOtpDto)).rejects.toThrow(
        RpcExceptionError,
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        phone: sendOtpDto.phone,
      });
      expect(mockOtpRepository.findOneBy).toHaveBeenCalledWith({
        userId: mockUser.id,
      });
    });
    it('should send Otp when user has been exist ', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockOtpRepository.findOneBy.mockResolvedValue(mockOtp);
      mockOtpRepository.save.mockResolvedValue(mockOtp);

      const result = await service.sendOtp(sendOtpDto);
      expect(result).toHaveProperty('code');
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        phone: sendOtpDto.phone,
      });
      expect(mockOtpRepository.findOneBy).toHaveBeenCalledWith({
        userId: mockUser.id,
      });
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
