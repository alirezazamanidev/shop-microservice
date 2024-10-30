import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/user/app.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
import { join } from 'path';
import { GetFilters } from './common/filters';
config({ path: join(process.cwd(), '..', '.env') });
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitMQ'],
      queue: 'user-queue',
    },
  } as RmqOptions);

  app.useGlobalFilters(...GetFilters());
  await app.listen();
  console.log('User Service Running ');
}
bootstrap();
