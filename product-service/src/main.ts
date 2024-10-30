import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { GetFilters } from './common/filters';
import {config} from 'dotenv'
import { join } from 'path';
config({path:join(process.cwd(),'..','.env')});
async function bootstrap() {
  const app = await NestFactory.createMicroservice(ProductModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitMQ'],
      queue: 'product-queue',
    },
  } as RmqOptions);
  app.useGlobalFilters(...GetFilters());

  await app.listen();
  console.log('product service running!');
}
bootstrap();
