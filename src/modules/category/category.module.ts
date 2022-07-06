import { forwardRef, Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ItemModule } from "../item/item.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    ConfigModule,
    forwardRef(() => UserModule),
    JwtModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
