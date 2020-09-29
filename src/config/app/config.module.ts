import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import configuration from './configuration';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        APP_NAME: Joi.string().default('api'),
        APP_URL: Joi.string().default('http://127.0.0.1:3000'),
        APP_PORT: Joi.number().default(3000),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
