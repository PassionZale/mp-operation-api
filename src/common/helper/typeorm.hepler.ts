import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';

import { ORMCONFIG } from '@src/common/constant/filename.constant';

export function findOrCreateOrmConfigSync(configs: TypeOrmModuleOptions): void {
  if (!fs.existsSync(ORMCONFIG)) {
    fs.writeFileSync(ORMCONFIG, JSON.stringify(configs, null, 2));
  }
}
