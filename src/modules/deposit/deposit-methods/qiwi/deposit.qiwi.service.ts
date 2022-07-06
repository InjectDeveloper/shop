import {HttpException, Injectable} from "@nestjs/common";

import {QiwiLib} from "./qiwi.lib";
import { DepositService } from "../../deposit.service";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../../user/user.service";
import { UserEntity } from "../../../user/entities/user.entity";
import { DepositPayMethodsInterface } from "../../interfaces/deposit.payMethods.interface";
import { DepositRegisterDto } from "../../dto/deposit.register.dto";
import { DepositCreateDto } from "../../dto/deposit.create.dto";
import { DepositEntity } from "../../entities/deposit.entity";


@Injectable()
export class DepositQiwiService implements DepositPayMethodsInterface{
  private readonly qiwiApi: QiwiLib
  constructor(
    private readonly depositService: DepositService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    this.qiwiApi = new QiwiLib()
  }

  async createDeposit(depositDto: DepositRegisterDto, user: UserEntity) {
    const comment = await this.qiwiApi.createPaymentComment()
    const newDeposit: DepositCreateDto = {
      user: user,
      data: comment,
      sum: depositDto.sum,
      type: depositDto.type,
      expires_in: await this.depositService.getExpiresTime(this.configService.get("DEPOSIT_LIFETIME")),
    }

    const depo = await this.depositService.createDeposit(newDeposit)
    return {
      phone: this.configService.get("QIWI_PHONE"),
      sum: depo.sum,
      comment: depo.data
    }
  }

  async checkDeposit(deposit: DepositEntity, userId: number): Promise<UserEntity> {
    const transaction = await this.qiwiApi.getDepositByCommentAndSum(deposit.data, deposit.sum)
    if (!transaction) {
      throw new HttpException("Платёж не поступил", 400)
    }
    await this.depositService.finishDeposits(userId)
    return await this.userService.updateBalance(userId, deposit.sum)
  }
}