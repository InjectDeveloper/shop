import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthNotRegisteredYetException extends HttpException {
  constructor() {
    super("Пользователя с данным email не существует", HttpStatus.BAD_REQUEST );
  }
}