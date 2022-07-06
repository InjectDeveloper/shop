import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthNotAuthException extends HttpException {
  constructor() {
    super("Пользователь не авторизован", HttpStatus.UNAUTHORIZED );
  }
}