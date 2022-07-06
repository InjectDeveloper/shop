import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserGoogleDto } from "../../../user/dto/user.google.dto";
import { AuthRegisteredWithGoogleException } from "../../exception/auth.registeredWithGoogle.exception";


@Injectable()
export class AuthGoogleService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(user: UserGoogleDto) {
    const candidate = await this.userService.getByEmail(user.email)
    if (!candidate){
      const newUser = await this.userService.createWithGoogle(user.email, user.name)
      return newUser
    } else {

      if (candidate.isRegisteredWithGoogle != true) {
        throw new AuthRegisteredWithGoogleException()
      }

      return candidate
    }
  }
}