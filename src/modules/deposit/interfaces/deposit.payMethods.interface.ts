import { DepositRegisterDto } from "../dto/deposit.register.dto";
import { DepositCreateDto } from "../dto/deposit.create.dto";
import { UserEntity } from "../../user/entities/user.entity";
import { DepositEntity } from "../entities/deposit.entity";

export interface DepositPayMethodsInterface {
  createDeposit(registerDepositDto: DepositRegisterDto, user: UserEntity)
  checkDeposit(deposit: DepositEntity, userId: number): Promise<UserEntity>
}