import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: String;

    @IsString()
    @IsOptional()
    displayname?: String
}