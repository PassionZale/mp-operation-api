import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import configuration from './configuration';
import { DatabaseConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        DATABASE_DIALECT: Joi.string()
          .valid('mysql', 'mariadb', 'postgres', 'mssql')
          .default('mysql'),
        DATABASE_HOST: Joi.string().default('127.0.0.1'),
        DATABASE_PORT: Joi.number().default(3306),
        DATABASE_USERNAME: Joi.string().default('root'),
        DATABASE_PASSWORD: Joi.string().default('root'),
        DATABASE_DATABASE: Joi.string().default('api'),
      }),
    }),
  ],
  providers: [ConfigService, DatabaseConfigService],
  exports: [ConfigService, DatabaseConfigService],
})
export class DatabaseConfigModule {}
