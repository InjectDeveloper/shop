import {Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import {CategoryService} from "./category.service";
import { CategoryCreateDto } from "./dto/category.create.dto";
import { AuthRoleGuard } from "../auth/guards/auth.role.guard";

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  @Get()
  async getAll() {
    return await this.categoryService.getAllCategories()
  }

  @UseGuards(AuthRoleGuard)
  @Post()
  async create(@Body() categoryDto: CategoryCreateDto) {
    Logger.log(categoryDto)
    return await this.categoryService.create(categoryDto)
  }

  @UseGuards(AuthRoleGuard)
  @Delete(":categoryId")
  async delete(@Param('categoryId') categoryId: number) {
    return await this.categoryService.delete(categoryId)
  }
}
