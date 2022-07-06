import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { ItemModule } from "../item/item.module";
import { UserFavouriteItemsEntity } from "./entities/user.favouriteItems.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserFavouriteItemsEntity]),
    forwardRef(() => ItemModule)
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
