import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';



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
export class AppModule {}

 