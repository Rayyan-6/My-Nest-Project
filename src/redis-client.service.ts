import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class RedisClientService implements OnModuleInit {
  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
    host: 'localhost',
    port: 6379,
  },
    });
  }

  getClient() {
    return this.client;
  }
}
