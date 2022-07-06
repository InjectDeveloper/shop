import {HttpException, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Like, Repository} from "typeorm";
import {ItemEntity} from "./entities/item.entity";
import {classToPlain} from "class-transformer";
import {CategoryService} from "../category/category.service";
import { UserRolesEnum } from "../user/constants/user.roles.enum";
import { ItemCreateDto } from "./dto/item.create.dto";
import { CategoryEntity } from "../category/entities/category.entity";

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity) private readonly itemsRepository: Repository<ItemEntity>,
    private readonly categoryService: CategoryService
  ) {}

  async get(subname: string) {
    if(subname) {
      const items = await this.itemsRepository.find({
        where: [
          { name: Like(`%${subname}%`) },
        ]
      })
      const protectedItems = classToPlain<ItemEntity>(items, {
        groups: [UserRolesEnum.USER]
      })

      return protectedItems
    } else {
      const items = await this.itemsRepository.find({
        where: [
          { name: Like(`%%`) },
        ]
      })
      const protectedItems = classToPlain<ItemEntity>(items, {
        groups: [UserRolesEnum.USER]
      })

      return protectedItems
    }
  }

  async create(itemDto: ItemCreateDto) {
    const findedCategory = await this.categoryService.getCategoryByName(itemDto.category)
    if(!findedCategory) {
      throw new HttpException("Такой категории не существует", 400)
    }

    const findedItem = await this.getItemByName(itemDto.name.toLowerCase())
    if(findedItem) {
      throw new HttpException("Товар с таким именем уже существует", 400)
    }

    const newItem = await this.itemsRepository.create({
      ...itemDto,
      category: findedCategory
    })
    await this.itemsRepository.save(newItem)
    return newItem
  }

  async delete(itemId: number) {
    const candidate = await this.getItemById(itemId)
    if(!candidate) {
      throw new HttpException("Такого товара не существует", 400)
    }
    await this.itemsRepository.delete(itemId)
    return candidate
  }

  async getItemById(itemId: number): Promise<ItemEntity> {
    return await this.itemsRepository.findOne({
      relations: {
        category: true
      },
      where: {
        id: itemId
      }
    })
  }

  async getItemByIdWithProducts(itemId: number): Promise<ItemEntity> {
    return await this.itemsRepository.findOne({
      relations: {
        category: true,
        products: true
      },
      where: {
        id: itemId
      }
    })
  }

  async getItemByName(name: string) {
    return await this.itemsRepository.findOne({
      relations: {
        category: true
      },
      where: {
        name: name
      }
    })
  }


  async addToLeft(itemId, amount) {
    let item: ItemEntity = await this.itemsRepository.findOne({
      where: {
        id: itemId
      }
    })

    item.left = item.left + amount
    await this.itemsRepository.save(item)
  }

  async minToLeft(itemId, amount) {
    let item: ItemEntity = await this.itemsRepository.findOne({
      where: {
        id: itemId
      }
    })

    item.left = item.left - amount
    await this.itemsRepository.save(item)
  }
}
