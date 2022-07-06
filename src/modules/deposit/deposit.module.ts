import { Module } from "@nestjs/common";
import { DepositController } from "./deposit.controller";
import { DepositService } from "./deposit.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepositEntity } from "./entities/deposit.entity";
import { UserModule } from "../user/user.module";
import { ConfigModule } from "@nestjs/config";
import { DepositQiwiService } from "./deposit-methods/qiwi/deposit.qiwi.service";
import { DepositCryptoService } from "./deposit-methods/crypto/deposit.crypto.service";
import { DepositCrystalPayService } from "./deposit-methods/crytalPay/deposit.crytalPay.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([DepositEntity]),
    UserModule,
    ConfigModule
  ],
  controllers: [DepositController],
  providers: [
    DepositService,
    DepositQiwiService,
    DepositCryptoService,
    DepositCrystalPayService
  ],
})
export class DepositModule {}
