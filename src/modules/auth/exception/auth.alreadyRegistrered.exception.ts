import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthAlreadyRegistreredException extends HttpException {
  constructor() {
    super('Пользователь с данным email уже зарегистрирован', HttpStatus.BAD_REQUEST);
  }
}