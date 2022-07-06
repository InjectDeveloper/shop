import { HttpException, Injectable } from "@nestjs/common";
import { CryptoLib } from "./crypto.lib";
import { DepositService } from "../../deposit.service";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../../user/user.service";
import { DepositRegisterDto } from "../../dto/deposit.register.dto";
import { UserEntity } from "../../../user/entities/user.entity";
import { DepositCreateDto } from "../../dto/deposit.create.dto";
import { DepositEntity } from "../../entities/deposit.entity";
import { DepositTypesEnum } from "../../constants/deposit.types.enum";

@Injectable()
export class DepositCryptoService {
  private readonly cryptoApi: CryptoLib
  constructor(
    private readonly depositService: DepositService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    this.cryptoApi = new CryptoLib()
  }
  async createDeposit(depositDto: DepositRegisterDto, user: UserEntity) {
    const {price, newAdress} = await this.getAdressAndSum(depositDto.type, depositDto.sum)
    const newDeposit: DepositCreateDto = {
      user: user,
      data: newAdress,
      sum: price,
      type: depositDto.type,
      expires_in: await this.depositService.getExpiresTime(this.configService.get("DEPOSIT_LIFETIME")),
    }

    const depo = await this.depositService.createDeposit(newDeposit)
    return {
      adress: newAdress,
      sum: price
    }
  }

  async checkDeposit(deposit: DepositEntity, userId: number) {
    if (deposit.type == DepositTypesEnum.BTC) {
      let balance: any = await this.cryptoApi.getBTCAdressBalance(deposit.data)

      if (balance < deposit.sum) {
        throw new HttpException("Платёж не поступил", 400)
      }
      await this.depositService.finishDeposits(userId)

      const sum = balance * 60 * await this.cryptoApi.getBTCprice()
      return await this.userService.updateBalance(userId, sum)
    } else {
      let balance: any = await this.cryptoApi.getLTCAdressBalance(deposit.data)

      if (balance < deposit.sum) {
        throw new HttpException("Платёж не поступил", 400)
      }
      await this.depositService.finishDeposits(userId)

      const sum = balance * 60 * await this.cryptoApi.getLTCprice()
      return await this.userService.updateBalance(userId, sum)
    }
  }


  private async getAdressAndSum(type, sum) {
    if(type == DepositTypesEnum.BTC) {
      const price: number = await this.cryptoApi.getPriceInBTC(sum)
      const newAdress: string = await this.cryptoApi.getNewBTCAdress()
      return {
        price: price,
        newAdress: newAdress
      }
    } else {
      const price: number = await this.cryptoApi.getPriceInLTC(sum)
      const newAdress: string = await this.cryptoApi.getNewLTCAdress()
      return {
        price: price,
        newAdress: newAdress
      }
    }
  }

}