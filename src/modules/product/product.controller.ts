import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthRoleGuard } from "../auth/guards/auth.role.guard";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  @UseGuards(AuthRoleGuard)
  @Post(":itemId")
  async add(
    @Param("itemId") itemId: number,
    @Body("data") data: string
  ) {
    return await this.productService.add(itemId, data)
  }


  /*@Get()
  async test() {
    return await this.productService.getForSale(4, 3)
  }*/
}
