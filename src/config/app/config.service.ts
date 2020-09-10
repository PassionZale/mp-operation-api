import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IAppConfigOptions {
  env: string;
  name: string;
  url: string;
  port: number;
}

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get configs(): IAppConfigOptions {
    return {
      env: this.env,
      name: this.name,
      url: this.url,
      port: this.port,
    };
  }

  get env(): string {
    return this.configService.get<string>('app.env');
  }

  get name(): string {
    return this.configService.get<string>('app.name');
  }

  get url(): string {
    return this.configService.get<string>('app.url');
  }

  get port(): number {
    return this.configService.get<number>('app.port');
  }
}
