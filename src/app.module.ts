import { Module } from '@nestjs/common';

import { ConfigurationServeStaticModule } from './configuration/configuration.serveStatic.module';
import { ConfigurationDataBaseModule } from './configuration/configuration.database.module';
import { ConfigurationEnvValidationModule } from './configuration/configuration.envValidation.module';

import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigurationEnvValidationModule,
        ConfigurationDataBaseModule,
        ConfigurationServeStaticModule,

        UserModule,
    ]
})
export class AppModule { }