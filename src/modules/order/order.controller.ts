import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthRoleGuard } from "../auth/guards/auth.role.guard";
import { AuthJwtAccessGuard } from "../auth/guards/auth.jwt.access.guard";
import { UserReqDecorator } from "../user/decorators/user.req.decorator";
import { UserEntity } from "../user/entities/user.entity";
import { OrderService } from "./order.service";

@Controller("order")
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) {}
  @UseGuards(AuthJwtAccessGuard)
  @Post()
  async create(
    @UserReqDecorator() user: UserEntity,
    @Body("itemsId") itemsId: Array<number>
  ) {
    return await this.orderService.create(user, itemsId)
  }
}
