import { Controller, Get, Post, Body } from '@nestjs/common';
import { PipeLineService } from './pipeline.service';
import { PipeLineEntity } from './entity/pipeline.entity';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';

@Controller()
export class PipeLineController {
  constructor(private readonly pipeLineService: PipeLineService) {}

  @Get('pipelines')
  public async findAll(): Promise<PipeLineEntity[]> {
    return this.pipeLineService.findAll();
  }

  @Post('pipeline')
  public async create(@Body() body: CreatePipeLineRequestDto): Promise<PipeLineEntity> {
    return this.pipeLineService.create(body)
  }
}
