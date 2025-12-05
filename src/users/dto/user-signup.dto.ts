import { IsEmail, IsNotEmpty, isString, IsString, MinLength } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";

export class UserSignUpDto  extends UserSignInDto{
    @IsNotEmpty({message: "Name cannot be null"})
    @IsString({message: "Name should be a string"})
    name: string;
}