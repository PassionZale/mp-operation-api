import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';

import { SEQUELIZE } from '@src/common/constants/provides';
import { DatabaseConfigService } from '@src/configs/database/config.service';
import { AppConfigService } from '@src/configs/app/config.service';


export const DatabaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (
      databaseConfigService: DatabaseConfigService,
      appConfigService: AppConfigService,
    ): Promise<Sequelize> => {
      const sequelize = new Sequelize(
        databaseConfigService.database,
        databaseConfigService.username,
        databaseConfigService.password,
        {
          host: databaseConfigService.host,
          port: databaseConfigService.port,
          username: databaseConfigService.username,
          password: databaseConfigService.password,
          database: databaseConfigService.database,
          dialect: databaseConfigService.dialect as Dialect,
          logging: console.log,
        },
      );

      sequelize.addModels([__dirname + '../modules/**/*.entity.ts']);

      await sequelize.sync({ force: appConfigService.env === 'development' });

      return sequelize;
    },
    inject: [DatabaseConfigService, AppConfigService],
  },
];
