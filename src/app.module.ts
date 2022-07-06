import { Module } from "@nestjs/common";

import { ConfigurationServeStaticModule } from "./configuration/configuration.serveStatic.module";
import { ConfigurationDataBaseModule } from "./configuration/configuration.database.module";
import { ConfigurationEnvValidationModule } from "./configuration/configuration.envValidation.module";

import { UserModule } from "./modules/user/user.module";
import { DepositModule } from "./modules/deposit/deposit.module";
import { ReviewModule } from "./modules/review/review.module";
import { CategoryModule } from "./modules/category/category.module";
import { ItemModule } from "./modules/item/item.module";
import { ProductModule } from "./modules/product/product.module";
import { OrderModule } from "./modules/order/order.module";
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigurationEnvValidationModule,
    ConfigurationDataBaseModule,
    ConfigurationServeStaticModule,

    UserModule,

    DepositModule,

    ReviewModule,

    CategoryModule,

    ItemModule,

    ProductModule,

    OrderModule,

    AuthModule,
  ],
})
export class AppModule {}
