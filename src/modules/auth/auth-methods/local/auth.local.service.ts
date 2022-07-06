import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt"
import {classToPlain} from "class-transformer";
import { UserService } from "../../../user/user.service";
import { UserCreateDto } from "../../../user/dto/user.create.dto";
import { UserEntity } from "../../../user/entities/user.entity";

import { UserRolesEnum } from "../../../user/constants/user.roles.enum";
import { AuthTokenPayloadInterface } from "../../interfaces/auth.tokenPayload.interface";
import { AuthAlreadyRegistreredException } from "../../exception/auth.alreadyRegistrered.exception";
import { AuthNotRegisteredYetException } from "../../exception/auth.notRegisteredYet.exception";

@Injectable()
export class AuthLocalService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(registrationData: UserCreateDto): Promise<UserEntity> | never {
    const candidate = await this.userService.getByEmail(registrationData.email)
    if(candidate) {
      throw new AuthAlreadyRegistreredException()
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 10)
    const createdUser = await this.userService.create({
      ...registrationData,
      password: hashedPassword
    })

    return createdUser
  }

  async getRegisteredUser(email: string, password: string): Promise<UserEntity> | never {
    const user = await this.userService.getByEmail(email)
    if(!user) {
      throw new AuthNotRegisteredYetException()
    }

    const isPasswordsMatching = await bcrypt.compare(
      password,
      user.password
    )

    if(isPasswordsMatching) {
      return user
    }
  }

  async getPairOfTokens(userId: number) {
    const user = await this.userService.getById(userId)
    return {
      accessToken: await this.getJwtAccessToken(user.id, user.role),
      refreshToken: await this.getJwtRefreshToken(user.id, user.role)
    }
  }
  public async getJwtAccessToken(userId: number, role: UserRolesEnum): Promise<string> {
    const payload: AuthTokenPayloadInterface = { userId,  role};
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_SECRET"),
      expiresIn: `${this.configService.get("JWT_ACCESS_EXPIRES_IN")}s`
    });

    return token;
  }
  public async getJwtRefreshToken(userId: number, role: UserRolesEnum): Promise<string> {
    const payload: AuthTokenPayloadInterface = { userId, role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRES_IN')}s`
    });
    await this.userService.setCurrentRefreshToken(token, userId)

    return token
  }
}