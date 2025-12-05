 import { IsEmail, IsNotEmpty, isString, IsString, MinLength } from "class-validator";
 
 export class UserSignInDto  {
     
     @IsNotEmpty({message: "emailcannot be null"})
     @IsEmail({},{message: "provide a valid email"})
     email: string;
 
     @IsNotEmpty({message: 'password cannot be empty'})
     @MinLength(6,{message:"enter atleast 6 characters"})
     password: string;
 }