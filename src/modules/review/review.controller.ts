import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { AuthJwtAccessGuard } from "../auth/guards/auth.jwt.access.guard";
import { UserReqDecorator } from "../user/decorators/user.req.decorator";
import { UserEntity } from "../user/entities/user.entity";
import { AuthRoleGuard } from "../auth/guards/auth.role.guard";

@Controller("review")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
  ) {}

  @UseGuards(AuthJwtAccessGuard)
  @Post()
  async create(@UserReqDecorator() user: UserEntity, @Body("text") text: string) {
    return await this.reviewService.create(user, text)
  }

  @Get()
  async get() {
    return await this.reviewService.getAll()
  }

  @UseGuards(AuthRoleGuard)
  @Delete(":id")
  async delete(@Param("id") id: number) {
    return await this.reviewService.delete(id)
  }
}
