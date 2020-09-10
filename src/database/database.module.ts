import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { TypeormConfigModule } from '@src/config/typeorm/config.module';

@Module({
  imports: [TypeormConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
