import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormDbConfig } from '../../config/typeOrm-config';
import { UserModule } from './user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass:TypeormDbConfig,
      inject:[TypeormDbConfig]
    }),
    UserModule,
    AuthModule,

  ],
  providers:[TypeormDbConfig]
})
export class AppModule {}
