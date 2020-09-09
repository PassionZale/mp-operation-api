import { Module } from '@nestjs/common';
import { DatabaseProviders } from './database.providers';
import { AppConfigModule } from '@src/configs/app/config.module';
import { DatabaseConfigModule } from '@src/configs/database/config.module';

@Module({
  imports: [AppConfigModule, DatabaseConfigModule],
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}
