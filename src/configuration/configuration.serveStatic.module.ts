import {Logger, Module} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'static'),
        }),
    ],
    exports: [
        ServeStaticModule
    ]
})
export class ConfigurationServeStaticModule {}