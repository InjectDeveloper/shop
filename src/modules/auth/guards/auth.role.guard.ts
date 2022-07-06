import { Observable } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { AuthNotAuthException } from "../exception/auth.notAuth.exception";
import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthTokenPayloadInterface } from "../interfaces/auth.tokenPayload.interface";
import { UserEntity } from "../../user/entities/user.entity";
import { UserRolesEnum } from "../../user/constants/user.roles.enum";
import { AuthForbiddenException } from "../exception/auth.forbidden.exception";

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();

      const header = request.headers?.authorization
      const tokenType = header?.split(" ")[0]
      const tokenData = header?.split(" ")[1]

      const payload: AuthTokenPayloadInterface = this.jwtService.verify(tokenData, {
        secret: this.configService.get("JWT_ACCESS_SECRET")
      })

      const user = await this.userService.getById(payload.userId)
      request.user = user
      return this.validate(user)
    } catch (e) {
      Logger.log(e)
      throw new AuthNotAuthException()
    }
  }

  validate(user: UserEntity): boolean {
    if (user.role == UserRolesEnum.ADMIN) {
      return true
    } else {
      throw new AuthForbiddenException()
    }
  }
}
