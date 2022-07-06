import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserCreateDto } from "./dto/user.create.dto";
import { UserAvatarsArray } from "./constants/user.avatars.array";
import * as bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import { DepositStatusesEnum } from "../deposit/constants/deposit.statuses.enum";
import { ItemService } from "../item/item.service";
import { UserFavouriteItemsEntity } from "./entities/user.favouriteItems.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserFavouriteItemsEntity) private readonly usersFavouritesRepository: Repository<UserFavouriteItemsEntity>,
    private readonly itemService: ItemService
  ) {}

  async create(userData: UserCreateDto): Promise<UserEntity> {
    const newUser = await this.usersRepository.create({
      ...userData,
      avatar: UserAvatarsArray[Math.floor(Math.random() * UserAvatarsArray.length - 1)]
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }
  async createWithGoogle(email: string, name: string): Promise<UserEntity> {
    const newUser = await this.usersRepository.create({
      email: email,
      password: await bcrypt.hash(uuidv4(), 10),
      isRegisteredWithGoogle: true,
      avatar: UserAvatarsArray[Math.floor(Math.random() * UserAvatarsArray.length - 1)],
    })
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getByEmail(email: string): Promise<UserEntity> | undefined {
    const user = await this.usersRepository.findOne({
      where: {
        email: email
      }
    });

    if (user) {
      return user
    }
  }
  async getById(id: number): Promise<UserEntity> | undefined {
    const user = await this.usersRepository.findOne({
      where: {
        id: id
      }
    });

    if (user) {
      return user
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      refreshToken: currentHashedRefreshToken
    });
  }
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<UserEntity> | undefined {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if(isRefreshTokenMatching) {
      return user
    }
  }

  async updateBalance(userId: number, sum: number) {
    Logger.log("тут")
    const user = await this.usersRepository.findOne({
      where: {
        id: userId
      }
    })
    user.balance = user.balance + sum
    await this.usersRepository.save(user)
    return user
  }
  async getActiveDeposit(userId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId
      },
      relations: {
        deposits: true
      }
    })

    const deposit = user.deposits.find((elem) => {
      if (elem.status == DepositStatusesEnum.IN_PROCESS) {
        return elem
      }
    })

    if(!deposit) {
      throw new HttpException("Нету активных депозитов", 400)
    }

    return {deposit, userId: user.id}
  }

  async favourite(user: UserEntity, itemId: number) {

    const item = await this.itemService.getItemById(itemId)
    if(!item) {
      throw new HttpException("Такого предмета не существует", HttpStatus.BAD_REQUEST)
    }

    const favouriteRaw = await this.usersFavouritesRepository.findOne({
      where: {
        userId: user.id,
        itemId: item.id
      }
    })

    Logger.log(favouriteRaw)

    if (favouriteRaw) {
      await this.usersFavouritesRepository.delete(favouriteRaw)
      return await this.getById(user.id)
    } else {
      const newUserFavourite = await this.usersFavouritesRepository.create({
        user: user,
        userId: user.id,
        item: item,
        itemId: item.id
      })
      await this.usersFavouritesRepository.save(newUserFavourite)
      return await this.getById(user.id)
    }
  }
}
