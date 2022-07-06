import { PassportStrategy } from '@nestjs/passport';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from "../../user/user.service";
import { AuthTokenPayloadInterface } from "../interfaces/auth.tokenPayload.interface";
import { UserEntity } from "../../user/entities/user.entity";

@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(Strategy, "jwt-access-token") {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.headers?.authorization?.split(' ')[1]
      }]),
      secretOrKey: configService.get('JWT_ACCESS_SECRET')
    });
  }

  async validate(payload: AuthTokenPayloadInterface): Promise<UserEntity> {
    const user = await this.userService.getById(payload.userId)
    return user
  }
}
