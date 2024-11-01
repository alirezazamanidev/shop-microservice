import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipeError } from './common/pipes/validation.pipe';
import { getGlobalFilters } from './common/filters';
import SwaggerConfig from './configs/swagger.config';
import { FileCleanupInterceptor } from './common/interceptors/FileCleanup.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalInterceptors(new FileCleanupInterceptor())
  app.useGlobalFilters(...getGlobalFilters(httpAdapter));
  app.useGlobalPipes(new ValidationPipeError());
  app.setGlobalPrefix('/api');
  //swaggger config 
  SwaggerConfig(app);
  await app.listen(process.env.GATEWAY_SERVICE_PORT,()=>{
    console.log(`server run http:localhost:${process.env.GATEWAY_SERVICE_PORT}/api`);
    console.log(`swagger run http:localhost:${process.env.GATEWAY_SERVICE_PORT}/swagger`);
    
  });
}
bootstrap();
