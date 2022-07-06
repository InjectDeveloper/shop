import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthJwtAccessGuard } from "../auth/guards/auth.jwt.access.guard";
import { UserReqDecorator } from "./decorators/user.req.decorator";
import { UserEntity } from "./entities/user.entity";
import { UserService } from "./user.service";
import { classToPlain } from "class-transformer";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @UseGuards(AuthJwtAccessGuard)
  @Get()
  async getUser(@UserReqDecorator() user: UserEntity) {
    const getUser = await this.userService.getById(user.id)
    const protectedUser = classToPlain(user, {groups: [user.role]})

    return protectedUser
  }

  @UseGuards(AuthJwtAccessGuard)
  @Post("favourite/:id")
  async favourite(@UserReqDecorator() user: UserEntity, @Param("id") itemId: number) {
    return await this.userService.favourite(user, itemId)
  }
}
