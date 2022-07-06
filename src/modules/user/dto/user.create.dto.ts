import {IsEmail, IsString, Length} from "class-validator";

export class UserCreateDto {
  @IsEmail()
  email: string

  @IsString()
  @Length(8, 32)
  password: string
}