import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthorizeGuard } from './guards/authorize.guard';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { SignInHandler } from './commands/handlers/signin.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { GetUsersHandler } from './queries/handlers/get-users.handler';
import { UserCreatedHandler } from './events/handlers/user-created.handler';
import { CqrsModule } from '@nestjs/cqrs';

const CommandHandlers = [CreateUserHandler, SignInHandler];
const QueryHandlers = [GetUserHandler, GetUsersHandler];
const EventHandlers = [UserCreatedHandler];

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CqrsModule,
JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: "15m" },
    }),],
  controllers: [UsersController],
  providers: [...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    UsersService, 
    AuthorizeGuard
  ],
  exports: [UsersService]
})
export class UsersModule {}
