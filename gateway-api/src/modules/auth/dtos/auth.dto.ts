import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsNumberString, Length } from "class-validator";

export class SendOtpDto {
    @ApiProperty()
    @IsMobilePhone('fa-IR')
    phone:string
}
export class CheckOtpDto {

    @ApiProperty()
    @IsMobilePhone('fa-IR')
    phone:string
    @ApiProperty()
  
    @IsNotEmpty()
    @Length(5,5)
    @IsNumberString()
    code:string
  }