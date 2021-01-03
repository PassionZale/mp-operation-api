import { Controller, Get, Param } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { PipeLineService } from '../pipeline/service/pipeline.service';
import { ProjectEntity } from '../project/project.entity';

@Controller()
export class MiniProgramController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly pipelineService: PipeLineService,
  ) {}

  @Get('miniprogram/:id')
  public async findOne(@Param() id:number): Promise<ProjectEntity> {
    const project = await this.projectService.findOne(id)

    if (project) {
      project.pipelines = await this.pipelineService.findPipelinesAndDeploy(project.id)
    }

    return project
  }
}
