import { Controller, Get, Param } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { PipeLineService } from '../pipeline/service/pipeline.service';
import { ProjectEntity } from '../project/project.entity';
import { PipeLineEntity } from '../pipeline/entity/pipeline.entity';

@Controller()
export class MiniProgramController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly pipelineService: PipeLineService,
  ) {}

  @Get('miniprogram/:id/pipeline/:pid')
  public async findPipeline(@Param('id') id:number, @Param('pid') pid: number): Promise<PipeLineEntity> {
    const pipeline = await this.pipelineService.findPipelineDeloyLogs(id, pid)

    return pipeline
  }

  @Get('miniprogram/:id')
  public async findOne(@Param() id:number): Promise<ProjectEntity> {
    const project = await this.projectService.findOne(id)

    if (project) {
      project.pipelines = await this.pipelineService.findPipelinesAndDeploy(project.id)
    }

    return project
  }
}
