import { IsEmail, IsNotEmpty, isString, IsString, MinLength } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UserSignUpDto  extends UserSignInDto{
    
    @IsNotEmpty({message: "Name cannot be null"})
    @IsString({message: "Name should be a string"})
    @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
    name: string;
}