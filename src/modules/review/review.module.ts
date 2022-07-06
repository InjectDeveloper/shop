import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewEntity } from "./entities/review.entity";
import { UserService } from "../user/user.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    ConfigModule,
    UserModule,
    JwtModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
