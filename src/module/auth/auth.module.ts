import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '@src/module/user/user.module';
import { JwtConfigService } from '@src/config/jwt/config.service';
import { JwtConfigModule } from '@src/config/jwt/config.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtConfigModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      inject: [JwtConfigService],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secret,
        signOptions: { expiresIn: jwtConfigService.expiration_time },
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
