import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigModule } from '@src/config/typeorm/config.module';
import { TypeormConfigService } from '@src/config/typeorm/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [TypeormConfigModule],
      inject: [TypeormConfigService],
      useFactory: (typeormConfigService: TypeormConfigService) => {
        const configs = typeormConfigService.configs;

        return { ...configs };
      },
    }),
  ],
})
export class DatabaseModule {}
