import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PipeLineEntity } from './entity/pipeline.entity';
import { PipeLineDeployLogEntity } from './entity/pipeline-deploy-log.entity';
import { PipeLineReleaseLogEntity } from './entity/pipeline-release-log.entity';
import { PipeLineService } from './service/pipeline.service';
import { PipeLineController } from './controller/pipeline.controller';
import { PipeLineDeployService } from './service/pipeline-deploy.service';
import { PipeLineDeployController } from './controller/pipeline-deploy.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PipeLineEntity,
      PipeLineDeployLogEntity,
      PipeLineReleaseLogEntity,
    ]),
  ],
  providers: [PipeLineService, PipeLineDeployService],
  controllers: [PipeLineController, PipeLineDeployController],
  exports: [PipeLineService, PipeLineDeployService],
})
export class PipeLineModule {}
