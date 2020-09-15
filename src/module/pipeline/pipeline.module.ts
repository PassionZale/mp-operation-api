import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipeLineEntity } from './entity/pipeline.entity';
import { PipeLineDeployLogEntity } from './entity/pipeline-deploy-log.entity';
import { PipeLineReleaseLogEntity } from './entity/pipeline-release-log.entity';
import { PipeLineService } from './pipeline.service';
import { PipeLineController } from './pipeline.controller';
import { AppConfigModule } from '@src/config/app/config.module';
import { PipeLineDeployService } from './pipeline-deploy.service';
import { PipeLineDeployController } from './pipeline-deploy.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PipeLineEntity,
      PipeLineDeployLogEntity,
      PipeLineReleaseLogEntity,
    ]),
    AppConfigModule
  ],
  providers: [PipeLineService, PipeLineDeployService],
  controllers: [PipeLineController, PipeLineDeployController],
  exports: [PipeLineService, PipeLineDeployService],
})
export class PipeLineModule {}
