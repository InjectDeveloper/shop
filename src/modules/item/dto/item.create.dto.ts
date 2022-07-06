import {IsNumber, IsString, IsUrl} from "class-validator";

export class ItemCreateDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsUrl()
  img: string

  @IsUrl()
  bannerImg: string

  @IsString()
  category: string

  @IsString()
  tag: string

  @IsNumber()
  rating: number

  @IsNumber()
  price: number
}