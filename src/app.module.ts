import { Module } from '@nestjs/common';

// CONFIG
import { AppConfigModule } from './config/app/config.module';
import { JwtConfigModule } from './config/jwt/config.module';
import { TypeormConfigModule } from './config/typeorm/config.module';

// DATABASE
import { DatabaseModule } from './database/database.module';

// MODULE
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    AppConfigModule,
    JwtConfigModule,
    TypeormConfigModule,

    DatabaseModule,

    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
