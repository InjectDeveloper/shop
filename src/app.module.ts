import { Module } from '@nestjs/common';

import { ConfigurationServeStaticModule } from './configuration/configuration.serveStatic.module';
import { ConfigurationDataBaseModule } from './configuration/configuration.database.module';
import { ConfigurationEnvValidationModule } from './configuration/configuration.envValidation.module';

import { UserModule } from './modules/user/user.module';
import { DepositModule } from './modules/deposit/deposit.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
    imports: [
        ConfigurationEnvValidationModule,
        ConfigurationDataBaseModule,
        ConfigurationServeStaticModule,

        UserModule,

        DepositModule,

        ReviewModule,
    ]
})
export class AppModule { }