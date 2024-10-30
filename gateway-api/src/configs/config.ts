import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';

export interface IConfigService {
  port: number;
  userService: any;
}
@Injectable()
export class ConfigService {
  private envConfig: Partial<IConfigService>;

  constructor() {
    this.envConfig = {};
    this.envConfig.port = +process.env.GATEWAY_SERVICE_PORT;
    this.envConfig.userService = {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitMQ'],
        queue: 'user-queue',
        queueOptions: {},
      },
    } as RmqOptions;
  }
  get(key: keyof IConfigService) {
    return this.envConfig[key];
  }
}
