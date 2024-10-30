import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class SendOtpDto {
  @IsMobilePhone('fa-IR')
  phone: string;
}
export class CheckOtpDto {
  @IsMobilePhone('fa-IR')
  phone: string;

  @IsNotEmpty()
  @Length(5, 5)
  @IsNumberString()
  code: string;
}

export class CheckLoginDto {
    @IsString()
    @IsNotEmpty()
    token:string
}
