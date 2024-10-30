import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './entities/otp.entity';
import { UserEntity } from './entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([OtpEntity,UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports:[TypeOrmModule]
})
export class UserModule {}
