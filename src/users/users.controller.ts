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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post('signup')
  async signup(@Body() userSignUpDto:UserSignUpDto):Promise<UserEntity>{
    console.log(userSignUpDto)
    return await this.usersService.signup(userSignUpDto)
  }

  @Post('signin')
  async signin(@Body() userSignInDto:UserSignInDto):Promise<{
    accessToken: string;
    user: UserEntity;
}>{
    const user= await this.usersService.signin(userSignInDto)
    const accessToken = await this.usersService.accessToken(user)

    return {accessToken, user}
  }

  
  @UseGuards(AuthorizeGuard, RoleCheckGuard)
  @Rolesalt('admin')
  @Get()
  async findAll(){
    return await this.usersService.findAll()
  }

  @UseGuards(AuthorizeGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity){
    return currentUser
  }


  @UseGuards(AuthorizeGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
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
