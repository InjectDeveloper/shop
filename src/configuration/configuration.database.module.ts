import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { DatabaseType } from "typeorm";
import { join } from "path";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: "postgres" as DatabaseType,
          host: configService.get("POSTGRES_HOST"),
          port: configService.get("POSTGRES_PORT"),
          username: configService.get("POSTGRES_USER"),
          password: configService.get("POSTGRES_PASSWORD"),
          database: configService.get("POSTGRES_DB"),
          logging: false,
          synchronize: true,
          migrationsRun: false,
          extra: {
            max: 10,
            connectionTimeoutMillis: 2000,
          },
          autoLoadEntities: true,
          entities: [join(__dirname, "..", "/**/*.entity.js")],
        };
      },
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class ConfigurationDataBaseModule {}
