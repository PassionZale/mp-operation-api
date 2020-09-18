import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeormConfigService {
  constructor(private configService: ConfigService) {}

  get configs(): TypeOrmModuleOptions {
    return {
      // 项目中使用 migrations，自动同步务必设置为 false
      // 不允许更改此配置项
      synchronize: false,

      // .env settings
      type: this.type as 'mysql' | 'mariadb',
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      entities: this.entities,
      logging: this.logging,

      // migration settings
      migrationsTableName: 'migration',
      migrations: ['dist/database/migration/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/database/migration',
      },
    };
  }

  get type(): string {
    return this.configService.get<string>('typeorm.type');
  }

  get host(): string {
    return this.configService.get<string>('typeorm.host');
  }

  get port(): number {
    return this.configService.get<number>('typeorm.port');
  }

  get username(): string {
    return this.configService.get<string>('typeorm.username');
  }

  get password(): string {
    return this.configService.get<string>('typeorm.password');
  }

  get database(): string {
    return this.configService.get<string>('typeorm.database');
  }

  get entities(): string[] {
    return [this.configService.get<string>('typeorm.entities')];
  }

  get logging(): boolean {
    return this.configService.get<string>('typeorm.logging') === 'true';
  }
}
