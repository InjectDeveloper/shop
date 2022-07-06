import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DepositEntity } from "./entities/deposit.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { DepositCreateDto } from "./dto/deposit.create.dto";
import { DepositStatusesEnum } from "./constants/deposit.statuses.enum";
import * as dayjs from "dayjs";

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(DepositEntity) private readonly depositsRepository: Repository<DepositEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async createDeposit(depositDto: DepositCreateDto) {
    await this.depositsRepository.update({
      status: DepositStatusesEnum.IN_PROCESS
    }, {
      status: DepositStatusesEnum.CANCEL
    })

    const newDepo = await this.depositsRepository.create({
      user: depositDto.user,
      type: depositDto.type,
      sum: depositDto.sum,
      data: depositDto.data,
      expires_in: depositDto.expires_in
    })
    await this.depositsRepository.save(newDepo)

    return newDepo
  }

  async finishDeposits(userId) {
    const depo = await this.depositsRepository.findOne({
      where: {
        user: userId,
        status: DepositStatusesEnum.IN_PROCESS
      }
    })

    depo.status = DepositStatusesEnum.SUCCESS
    await this.depositsRepository.save(depo)
  }

  getExpiresTime(lifetime: number): dayjs.Dayjs {
    return dayjs()
      .add(this.configService.get("SERVER_TIMEZONE"), 'h')
      .add(lifetime, "m")
  }
}
