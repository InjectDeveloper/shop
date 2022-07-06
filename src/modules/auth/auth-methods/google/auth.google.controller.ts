import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGoogleGuard } from "../../guards/auth.google.guard";
import { UserReqDecorator } from "../../../user/decorators/user.req.decorator";
import { AuthGoogleService } from "./auth.google.service";
import { AuthLocalService } from "../local/auth.local.service";
import { UserGoogleDto } from "../../../user/dto/user.google.dto";
import { classToPlain } from "class-transformer";

@Controller('auth/google')
export class AuthGoogleController {
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    private readonly authLocalService: AuthLocalService
  ) {}

  @Get()
  @UseGuards(AuthGoogleGuard)
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGoogleGuard)
  async googleAuthRedirect(@UserReqDecorator() user: UserGoogleDto) {
    const newUser = await this.authGoogleService.authenticate(user)
    const protectedUser = classToPlain(newUser, {groups: [newUser.role]})

    return {
      user: protectedUser,
      tokens: await this.authLocalService.getPairOfTokens(newUser.id)
    }
  }
}