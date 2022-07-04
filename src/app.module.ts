import { ConfigurationServeStaticModule } from './configuration/configuration.serveStatic.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { ConfigurationDataBaseModule } from './configuration/configuration.database.module';
import { ConfigurationEnvValidationModule } from './configuration/configuration.envValidation.module';


@Module({
  imports: [
    ConfigurationEnvValidationModule,
    ConfigurationDataBaseModule,
    ConfigurationServeStaticModule,
  ]
})
export class AppModule {}