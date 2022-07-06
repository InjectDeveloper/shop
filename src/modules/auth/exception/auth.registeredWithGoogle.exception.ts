import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthRegisteredWithGoogleException extends HttpException {
  constructor() {
    super("Пользователь зарегестрированым другим способом", HttpStatus.UNAUTHORIZED );
  }
}