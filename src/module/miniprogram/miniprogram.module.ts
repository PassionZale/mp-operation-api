import { Module } from '@nestjs/common';
import { MiniProgramController } from './miniprogram.controller';
import { ProjectModule } from '../project/project.module';
import { PipeLineModule } from '../pipeline/pipeline.module';

@Module({
  imports: [ProjectModule, PipeLineModule],
  controllers: [MiniProgramController],
})
export class MiniProgramModule {}
