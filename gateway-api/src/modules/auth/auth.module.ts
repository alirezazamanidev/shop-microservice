import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigService } from 'src/configs/config';
import { Services } from 'src/common/enums/service.enum';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
    controllers:[AuthController],
    providers: [
        ConfigService,
        {
          provide: Services.User,
          useFactory(configService: ConfigService) {
            let userServiceOption = configService.get('userService');
            return ClientProxyFactory.create(userServiceOption);
          },
          inject: [ConfigService],
        },
      ],
})
export class AuthModule {
    
}
