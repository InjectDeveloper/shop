import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthForbiddenException extends HttpException {
  constructor() {
    super('Доступ запрещён', HttpStatus.FORBIDDEN);
  }
}