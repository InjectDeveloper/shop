import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { ItemModule } from "../item/item.module";
import { OrderEntity } from "./entities/order.entity";
import { ProductModule } from "../product/product.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ConfigModule,
    JwtModule,
    UserModule,
    ItemModule,
    ProductModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
