import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthLocalService } from "./auth.local.service";
import { classToPlain } from "class-transformer";
import { UserCreateDto } from "../../../user/dto/user.create.dto";
import { AuthLocalGuard } from "../../guards/auth.local.guard";
import { UserReqDecorator } from "../../../user/decorators/user.req.decorator";
import { UserEntity } from "../../../user/entities/user.entity";
import { AuthJwtRefreshGuard } from "../../guards/auth.jwt.refresh.guard";
import { AuthJwtAccessGuard } from "../../guards/auth.jwt.access.guard";
import { AuthRoleGuard } from "../../guards/auth.role.guard";

@Controller('auth/local')
export class AuthLocalController {
  constructor(
    private readonly authLocalService: AuthLocalService
  ) {}

  @Post('register')
  async register(@Body() registrationData: UserCreateDto) {
    const newUser = await this.authLocalService.register(registrationData)
    const protectedUser = classToPlain(newUser, {groups: [newUser.role]})

    return {
      user: protectedUser,
      tokens: await this.authLocalService.getPairOfTokens(newUser.id)
    }
  }

  @UseGuards(AuthLocalGuard)
  @Post('login')
  async login(@UserReqDecorator() user: UserEntity) {
    const protectedUser = classToPlain(user, {groups: [user.role]})

    return {
      user: protectedUser,
      tokens: await this.authLocalService.getPairOfTokens(user.id)
    }
  }

  @UseGuards(AuthJwtRefreshGuard)
  @Post('refresh')
  async refresh(@UserReqDecorator() user: UserEntity) {
    const protectedUser = classToPlain(user, {groups: [user.role]})

    return {
      user: protectedUser,
      tokens: await this.authLocalService.getPairOfTokens(user.id)
    }
  }

  @UseGuards(AuthRoleGuard)
  @Post('/test')
  async test(@UserReqDecorator() user: UserEntity) {
    return user
  }
}