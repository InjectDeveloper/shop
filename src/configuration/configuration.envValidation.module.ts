import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                //APP
                PORT: Joi.number(),
                SERVER_TIMEZONE: Joi.number().required(),
                DEPOSIT_LIFETIME: Joi.number().required(),

                //Database
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.number().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),

                //JWT
                JWT_ACCESS_SECRET: Joi.string().required(),
                JWT_ACCESS_EXPIRES_IN: Joi.number().required(),
                JWT_REFRESH_SECRET: Joi.string().required(),
                JWT_REFRESH_EXPIRES_IN: Joi.number().required(),

                //Google oauth
                GOOGLE_CLIENT_ID: Joi.string().required(),
                GOOGLE_CLIENT_SECRET: Joi.string().required(),

                //QIWI
                QIWI_PHONE: Joi.number().required(),
                QIWI_API_KEY: Joi.string().required(),
                QIWI_API_URL: Joi.string().required(),

                //Crystal pay
                CRYSTALLPAY_API_URL: Joi.string().required(),
                CRYSTALPAY_API_KEY: Joi.string().required(),
                CRYSTALPAY_CASHBOX_NAME: Joi.string().required(),

                //BLOCK.IO
                BLOCKIO_BTC_API_KEY: Joi.string().required(),
                BLOCKIO_LTC_API_KEY: Joi.string().required(),
                BLOCKIO_API_URL: Joi.string().required(),
                BLOCKIO_PIN: Joi.string().required(),
            })
        })
    ],
    exports: [ConfigModule]
})
export class ConfigurationEnvValidationModule {}