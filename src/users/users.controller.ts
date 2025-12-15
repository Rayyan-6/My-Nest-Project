import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthorizeGuard } from './guards/authorize.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { RoleCheckGuard } from './guards/roleCheck.guard';
import { Rolesalt } from 'src/utility/decorators/role-check.decorator';

import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user.command';
import { SignInCommand } from './commands/signin.command';
import { GetUserQuery } from './queries/get-user.query';
import { GetUsersQuery } from './queries/handlers/get-users.handler'
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { sanitizeOutput } from 'src/utility/common/sanitize.util';
import { JwtAuthGuard } from 'src/auth0/jwt-auth.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,

  ) {}


  @Post('signup')
  async signup(@Body() userSignUpDto:UserSignUpDto){
  // async signup(@Body() userSignUpDto:UserSignUpDto):Promise<UserEntity>{
    console.log(userSignUpDto)
    // return await this.usersService.signup(userSignUpDto)
    // return await this.commandBus.execute(new CreateUserCommand(userSignUpDto.name, userSignUpDto.email, userSignUpDto.password));

      const cleanData = sanitizeOutput(userSignUpDto);

    return await this.commandBus.execute(
    new CreateUserCommand(cleanData.name, cleanData.email, cleanData.password),
  );
  }

  @Post('signin')
  async signin(@Body() userSignInDto:UserSignInDto){
//   async signin(@Body() userSignInDto:UserSignInDto):Promise<{
//     accessToken: string;
//     user: UserEntity;
// }>{
    const user= await this.usersService.signin(userSignInDto)
    const accessToken = await this.usersService.accessToken(user)

    // return {accessToken, user}
    // return await this.commandBus.execute(new SignInCommand(userSignInDto.email, userSignInDto.password));
    const cleanData = sanitizeOutput(userSignInDto);

  return await this.commandBus.execute(
    new SignInCommand(cleanData.email, cleanData.password),
  );
  }

  
  // @UseGuards(AuthorizeGuard, RoleCheckGuard)
  // @Rolesalt('admin')
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(){
     console.log('🚀 Find all users Controller reached');
    // return await this.usersService.findAll()
    return await this.queryBus.execute(new GetUsersQuery())
  }

  @UseGuards(AuthorizeGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity){
    return currentUser
  }


  @UseGuards(AuthorizeGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // return await this.usersService.findOne(+id);
    return await this.queryBus.execute(new GetUserQuery(+id));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  
}
