import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as rimraf from 'rimraf';
import * as fs from 'fs';

import { ORMCONFIG } from '@src/common/constant/filename.constant';

export function updateOrmConfigFileSync(configs: TypeOrmModuleOptions): void {
  const logger = new Logger('TypeormHelper');

  if (fs.existsSync(ORMCONFIG)) {
    logger.warn(`Removing ${ORMCONFIG}`);
    rimraf.sync(ORMCONFIG);
  }

  logger.warn(`Creating ${ORMCONFIG}`);

  fs.writeFileSync(ORMCONFIG, JSON.stringify(configs, null, 2));

  logger.log(`${ORMCONFIG} has been already updated`);
}
