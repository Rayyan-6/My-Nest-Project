import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';
import {EventEmitterModule} from '@nestjs/event-emitter'
import { EmailModule } from './email/email.module';
import { Auth0Module } from './auth0/auth0.module';


@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestjs_tutorial'),
    // UserModule
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    EventEmitterModule.forRoot(),
    EmailModule,
    Auth0Module
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(CurrentUserMiddleware)
    .forRoutes({path:'*', method: RequestMethod.ALL})
  }
}

 