import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './configs/app/config.module';
import { DatabaseConfigModule } from './configs/database/config.module';
import { JwtConfigModule } from './configs/jwt/config.module';

import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseConfigModule,
    JwtConfigModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
