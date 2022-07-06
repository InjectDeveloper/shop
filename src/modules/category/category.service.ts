import {HttpException, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CategoryEntity} from "./entities/category.entity";
import { CategoryCreateDto } from "./dto/category.create.dto";
import { ItemService } from "../item/item.service";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoriesRepository: Repository<CategoryEntity>,
  ) {}

  async create(categoryDto: CategoryCreateDto) {
    const candidate = await this.getCategoryByName(categoryDto.name)
    if (candidate) {
      throw new HttpException("Категория с таким названием уже существует", 400)
    }

    const newCategory = await this.categoriesRepository.create({
      name: categoryDto.name,
      img: categoryDto.img
    })
    await this.categoriesRepository.save(newCategory)

    return newCategory
  }

  async delete(categoryId: number) {
    const candidate = await this.getCategoryById(categoryId)

    if(!candidate) {
      throw new HttpException("Такой категории не существует", 400)
    }

    await this.categoriesRepository.delete(categoryId)
    return candidate
  }

  async getAllCategories() {
    return await this.categoriesRepository.find()
  }

  async getCategoryByName(name: string) {
    return await this.categoriesRepository.findOne({
      where: {
        name: name
      }
    })
  }

  async getCategoryById(categoryId: number) {
    return await this.categoriesRepository.findOne({
      where: {
        id: categoryId
      }
    })
  }

}
