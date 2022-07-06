import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemModule } from "../item/item.module";
import { ProductEntity } from "./entities/product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ConfigModule,
    JwtModule,
    UserModule,
    ItemModule
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
