import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthTokenPayloadInterface } from "../interfaces/auth.tokenPayload.interface";
import { UserService } from "../../user/user.service";

@Injectable()
export class AuthJwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.headers?.authorization?.split(' ')[1]
      }]),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: AuthTokenPayloadInterface) {
    const refreshToken = request?.headers?.authorization.split(' ')[1]
    return await this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
  }
}
