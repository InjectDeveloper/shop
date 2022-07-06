import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { Strategy } from 'passport-local';
import { AuthLocalService } from "../auth-methods/local/auth.local.service";
import { UserEntity } from "../../user/entities/user.entity";


@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authLocalService: AuthLocalService) {
    super({
      usernameField: 'email'
    });
  }
  async validate(email: string, password: string): Promise<UserEntity> {
    return this.authLocalService.getRegisteredUser(email, password);
  }
}
