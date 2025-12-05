import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';



@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestjs_tutorial'),
    // UserModule
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    
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

 