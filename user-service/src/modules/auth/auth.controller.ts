import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthPatterns } from './enums/auth-patterns';
import { CheckLoginDto, CheckOtpDto, SendOtpDto } from './dtos/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @MessagePattern(AuthPatterns.SendOtp)
   sendOtp(@Payload() sendOtpDto:SendOtpDto){
    return this.authService.sendOtp(sendOtpDto)

  }
  @MessagePattern(AuthPatterns.CheckOtp)
  checkOtp(@Payload() checkOtpDto:CheckOtpDto){
    return this.authService.checkOtp(checkOtpDto);
  }
  @MessagePattern(AuthPatterns.checkLogin)
  checkLogin(@Payload() checkLoginDto:CheckLoginDto ){
    return this.authService.checkLogin(checkLoginDto)
  }
}
