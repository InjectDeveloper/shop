import {IsEmail, IsEnum, IsNumber, IsString, Length} from "class-validator";
import { DepositTypesEnum } from "../constants/deposit.types.enum";

export class DepositRegisterDto {
  @IsEnum(DepositTypesEnum)
  type: DepositTypesEnum

  @IsNumber()
  sum: number
}