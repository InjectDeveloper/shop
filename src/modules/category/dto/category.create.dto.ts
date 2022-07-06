import {IsString, IsUrl} from "class-validator";

export class CategoryCreateDto {
  @IsString()
  name: string

  @IsUrl()
  img: string
}