import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ItemService } from "./item.service";
import { AuthRoleGuard } from "../auth/guards/auth.role.guard";
import { ItemCreateDto } from "./dto/item.create.dto";

@Controller("item")
export class ItemController {
  constructor(
    private readonly itemService: ItemService
  ) {}

  @Get()
  async get(@Query('name') subname: string) {
    return await this.itemService.get(subname)
  }

  @UseGuards(AuthRoleGuard)
  @Post()
  async create(@Body() itemDto: ItemCreateDto) {
    return await this.itemService.create(itemDto)
  }

  @UseGuards(AuthRoleGuard)
  @Delete(":itemId")
  async delete(@Param("itemId") itemId: number) {
    return await this.itemService.delete(itemId)
  }
}
