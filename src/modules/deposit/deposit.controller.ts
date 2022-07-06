import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { DepositService } from "./deposit.service";
import { DepositQiwiService } from "./deposit-methods/qiwi/deposit.qiwi.service";
import { AuthJwtAccessGuard } from "../auth/guards/auth.jwt.access.guard";
import { UserReqDecorator } from "../user/decorators/user.req.decorator";
import { UserEntity } from "../user/entities/user.entity";
import { DepositRegisterDto } from "./dto/deposit.register.dto";
import { DepositTypesEnum } from "./constants/deposit.types.enum";
import { UserService } from "../user/user.service";
import { DepositCryptoService } from "./deposit-methods/crypto/deposit.crypto.service";
import { DepositCrystalPayService } from "./deposit-methods/crytalPay/deposit.crytalPay.service";

@Controller("deposit")
export class DepositController {
  constructor(
    private readonly depositService: DepositService,
    private readonly qiwiService: DepositQiwiService,
    private readonly userService: UserService,
    private readonly cryptoService: DepositCryptoService,
    private readonly crystalPayService: DepositCrystalPayService
  ) {}

  @UseGuards(AuthJwtAccessGuard)
  @Post()
  async createDeposit(
    @UserReqDecorator() user: UserEntity,
    @Body() depositDto: DepositRegisterDto
  ) {
    switch (depositDto.type) {
      case DepositTypesEnum.QIWI:
        return await this.qiwiService.createDeposit(depositDto, user)
      case DepositTypesEnum.LTC:
        return await this.cryptoService.createDeposit(depositDto, user)
      case DepositTypesEnum.BTC:
        return await this.cryptoService.createDeposit(depositDto, user)
      case DepositTypesEnum.CR:
        return await this.crystalPayService.createDeposit(depositDto, user)
    }
  }

  @UseGuards(AuthJwtAccessGuard)
  @Get()
  async checkDeposit(@UserReqDecorator() user: UserEntity) {
    const deposit = await this.userService.getActiveDeposit(user.id)

    switch (deposit.deposit.type) {
      case DepositTypesEnum.QIWI:
        return await this.qiwiService.checkDeposit(deposit.deposit, deposit.userId)
      case DepositTypesEnum.BTC:
        return await this.cryptoService.checkDeposit(deposit.deposit, deposit.userId)
      case DepositTypesEnum.LTC:
        return await this.cryptoService.checkDeposit(deposit.deposit, deposit.userId)
      case DepositTypesEnum.CR:
        return await this.crystalPayService.checkDeposit(deposit.deposit, deposit.userId)
    }
  }
}
