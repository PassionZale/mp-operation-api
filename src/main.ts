import { NestFactory } from '@nestjs/core';
import * as moment from 'moment-timezone';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

moment.tz.setDefault('Asia/Shanghai');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig: AppConfigService = app.get(AppConfigService);

  await app.listen(appConfig.port);
}

bootstrap();

