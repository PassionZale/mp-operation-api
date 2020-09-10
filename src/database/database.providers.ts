import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { DATABASE_CONNECTION } from '@src/common/constant/provide.constant';
import { TypeormConfigService } from '@src/config/typeorm/config.service';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (
      typeormConfigService: TypeormConfigService,
    ): Promise<Connection> => {
      const configs = typeormConfigService.configs as ConnectionOptions;

      return await createConnection({ ...configs });
    },
    inject: [TypeormConfigService],
  },
];
