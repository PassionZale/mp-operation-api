import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IJwtConfigOptions {
  secret: string;
  expiration_time: string;
}

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get configs(): IJwtConfigOptions {
    return {
      secret: this.secret,
      expiration_time: this.expiration_time,
    };
  }

  get secret(): string {
    return this.configService.get<string>('jwt.secret');
  }

  get expiration_time(): string {
    return this.configService.get<string>('jwt.expiration_time');
  }
}
