 import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, isString, IsString, MinLength } from "class-validator";
 
 export class UserSignInDto  {
     
     @IsNotEmpty({message: "emailcannot be null"})
     @IsEmail({},{message: "provide a valid email"})
     @ApiProperty({ description: 'email of the user', example: 'Jdoe@gmail.com' })
     email: string;
 
     @IsNotEmpty({message: 'password cannot be empty'})
     @MinLength(6,{message:"enter atleast 6 characters"})
     @ApiProperty({ description: 'PWD of the user', example: 'John123Doe' })
     password: string;
 }