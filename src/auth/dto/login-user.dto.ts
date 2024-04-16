import { IsEmail, IsString, Length, Matches } from "class-validator";

export class LoginUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @Length(6,50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;


}