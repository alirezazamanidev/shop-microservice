import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OtpEntity } from '../user/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { RpcExceptionError } from 'src/common/exceptions/Rpc.exception';
import { randomInt } from 'crypto';
import { CheckLoginDto, CheckOtpDto, SendOtpDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private jwtService: JwtService,
  ) {}

  async sendOtp(sendotpDto: SendOtpDto) {
    let { phone } = sendotpDto;
    let user = await this.userRepository.findOneBy({ phone });
    if (!user) {
      user = this.userRepository.create({ phone });
      user = await this.userRepository.save(user);
    }
    if (user?.isBlocked)
      throw new RpcExceptionError({
        message: 'اکانت شما با این شماره مسدود شده است!',
        statusCode: HttpStatus.FORBIDDEN,
      });

    let otp = await this.createOtpForUser(user.id);
    return {
      message: 'کد تایید با موفقیت ارسال شد!',
      code: otp.code,
    };
  }

  private async createOtpForUser(userId: number) {
    let otp = await this.otpRepository.findOneBy({ userId });
    const code = randomInt(10000, 99999).toString();
    let expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    let existOtp = false;
    if (otp) {
      existOtp = true;
      if (otp.expiresIn > new Date())
        throw new RpcExceptionError({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'کد تایید منقضی نشده است!',
        });
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({ code, expiresIn, userId });
    }
    otp = await this.otpRepository.save(otp);
    if (!existOtp) {
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
    }
    return otp;
  }
  async checkOtp(checkOtpDto: CheckOtpDto) {
    let { code, phone } = checkOtpDto;

    let user = await this.userRepository.findOne({
      where: { phone },
      relations: { otp: true },
    });

    if (!user || !user?.otp)
      throw new RpcExceptionError({
        message: 'اکانت شما یافت نشد لطفا دوباره لاگین کنید!',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    let otp = user.otp;
    if (otp.expiresIn < new Date())
      throw new RpcExceptionError({
        message: 'مهلت استفاده از کد تایید به پایان رسیده است!',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    if (otp.code !== code)
      throw new RpcExceptionError({
        message: 'کد تایید صحیح نمی باشد',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    // generateJwt Token
    let token = this.generateJwtToken(user.id);
    console.log(token);

    return {
      message: 'با موفقیت وارد سایت شدید!',
      token,
    };
  }

  generateJwtToken(userId: number) {
    const token = this.jwtService.sign(
      { userId },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '7d',
      },
    );
    return token;
  }
  async checkLogin(checkLoginDto: CheckLoginDto) {
    let { token } = checkLoginDto;
    let { userId } = this.verifyJwtToken(token);
    let user = await this.userRepository.findOne({where: {id: userId },select:{id:true,username:true,fullname:true,phone_verify:true,created_at:true}});
    if (!user)
      throw new RpcExceptionError({
        message: 'دوباره وارد سایت شوید',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    return user;
  }

  verifyJwtToken(token) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (error) {
      throw new RpcExceptionError({
        message: 'دوباره وارد سایت شوید',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
