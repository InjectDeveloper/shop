import { forwardRef, Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemEntity } from "./entities/item.entity";
import { CategoryModule } from "../category/category.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity]),
    CategoryModule,
    ConfigModule,
    forwardRef(() => UserModule),
    JwtModule
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService]
})
export class ItemModule {}
