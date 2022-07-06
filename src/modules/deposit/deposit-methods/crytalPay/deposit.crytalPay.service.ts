import {HttpException, Injectable, Logger} from "@nestjs/common";
import { CrystalPayLib } from "./crystalPay.lib";
import { DepositService } from "../../deposit.service";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../../user/user.service";
import { DepositRegisterDto } from "../../dto/deposit.register.dto";
import { UserEntity } from "../../../user/entities/user.entity";
import { DepositCreateDto } from "../../dto/deposit.create.dto";
import { DepositEntity } from "../../entities/deposit.entity";

@Injectable()
export class DepositCrystalPayService {
  private readonly crystalPayApi: CrystalPayLib
  constructor(
    private readonly depositService: DepositService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    this.crystalPayApi = new CrystalPayLib()
  }

  async createDeposit(depositDto: DepositRegisterDto, user: UserEntity) {
    const depositData = await this.crystalPayApi.getDepositLink(depositDto.sum)
    const newDeposit: DepositCreateDto = {
      user: user,
      data: depositData.id,
      sum: depositDto.sum,
      type: depositDto.type,
      expires_in: await this.depositService.getExpiresTime(this.configService.get("DEPOSIT_LIFETIME"))
    }
    const depo = await this.depositService.createDeposit(newDeposit)
    return {
      url: depositData.url,
      sum: depositDto.sum
    }
  }

  async checkDeposit(deposit: DepositEntity, userId: number) {
    const transaction = await this.crystalPayApi.getDepositById(deposit.data)
    if (transaction.state != "payed") {
      throw new HttpException("Платёж не поступил", 400)
    }
    await this.depositService.finishDeposits(userId)
    return await this.userService.updateBalance(userId, deposit.sum)
  }
}