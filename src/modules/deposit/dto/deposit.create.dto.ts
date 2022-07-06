import {IsDate, IsEmail, IsEnum, IsNumber, IsString, Length} from "class-validator";
import * as dayjs from "dayjs";
import { UserEntity } from "../../user/entities/user.entity";
import { DepositTypesEnum } from "../constants/deposit.types.enum";

export class DepositCreateDto {
  user: UserEntity

  @IsEnum(DepositTypesEnum)
  type: DepositTypesEnum

  @IsNumber()
  sum: number

  @IsString()
  data: string

  @IsDate()
  expires_in: dayjs.Dayjs
}