import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { AuthLocalController } from "./auth-methods/local/auth.local.controller";
import { AuthLocalService } from "./auth-methods/local/auth.local.service";
import { AuthLocalStrategy } from "./strategies/auth.local.strategy";
import { AuthJwtRefreshStrategy } from "./strategies/auth.jwt.refresh.strategy";
import { AuthJwtAccessStrategy } from "./strategies/auth.jwt.access.strategy";
import { AuthGoogleService } from "./auth-methods/google/auth.google.service";
import { AuthGoogleController } from "./auth-methods/google/auth.google.controller";
import { AuthGoogleStrategy } from "./strategies/auth.google.strategy";
import { AuthRoleGuard } from "./guards/auth.role.guard";

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    UserModule,
    PassportModule
  ],
  controllers: [
    AuthLocalController,
    AuthGoogleController,
  ],
  providers: [
    AuthLocalService,
    AuthGoogleService,

    AuthLocalStrategy,
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,
    AuthGoogleStrategy,
  ]
})
export class AuthModule {}
