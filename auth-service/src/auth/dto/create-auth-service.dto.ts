import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class AuthRegisterDto{

    @IsNotEmpty()
    @IsString()
    fullname:string;

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    password:string;
    
}

export class AuthLoginDto{
    
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    password:string;
}

