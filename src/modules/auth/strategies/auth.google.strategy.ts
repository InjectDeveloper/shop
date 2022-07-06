import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import { UserGoogleDto } from "../../user/dto/user.google.dto";

@Injectable()
export class AuthGoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<UserGoogleDto> {
    const { name, emails, photos } = profile
    const user: UserGoogleDto = {
      email: emails[0].value,
      name: name.givenName,
      picture: photos[0].value,
      accessToken
    }
    return user
  }
}