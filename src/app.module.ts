import { Module } from '@nestjs/common';

// CONFIG
import { AppConfigModule } from './config/app/config.module';
import { JwtConfigModule } from './config/jwt/config.module';
import { TypeormConfigModule } from './config/typeorm/config.module';

// DATABASE
import { DatabaseModule } from './database/database.module';

// MODULE
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    AppConfigModule,
    JwtConfigModule,
    TypeormConfigModule,

    DatabaseModule,

    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
