import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipeLineEntity } from './entity/pipeline.entity';
import { PipeLineDeployLogEntity } from './entity/pipeline-deploy-log.entity';
import { PipeLineReleaseLogEntity } from './entity/pipeline-release-log.entity';
import { PipeLineService } from './pipeline.service';
import { PipeLineController } from './pipeline.controller';
import { AppConfigModule } from '@src/config/app/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PipeLineEntity,
      PipeLineDeployLogEntity,
      PipeLineReleaseLogEntity,
    ]),
    AppConfigModule
  ],
  providers: [PipeLineService],
  controllers: [PipeLineController],
  exports: [PipeLineService],
})
export class PipeLineModule {}
