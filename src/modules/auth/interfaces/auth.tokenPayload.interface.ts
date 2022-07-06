import { UserRolesEnum } from "../../user/constants/user.roles.enum";

export interface AuthTokenPayloadInterface {
  userId: number;
  role: UserRolesEnum;
}