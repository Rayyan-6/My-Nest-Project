import { Controller, Post, Body, Get } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/CreateUser.dto";

@Controller('users')
export class UsersController{

    constructor(private userService: UserService){}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto){
        console.log("Creating User Dto", createUserDto)
        return this.userService.createUser(createUserDto)
    }

}
