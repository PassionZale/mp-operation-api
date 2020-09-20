import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PipeLineEntity } from '../entity/pipeline.entity';
import { CreatePipeLineRequestDto } from '../dto/request/create-pipeline.request.dto';
import { PipeLineDeployLogEntity } from '../entity/pipeline-deploy-log.entity';

@Injectable()
export class PipeLineService {
  constructor(
    @InjectRepository(PipeLineEntity)
    private readonly pipeLineRepository: Repository<PipeLineEntity>,
    @InjectRepository(PipeLineDeployLogEntity)
    private readonly pipeLineDeployLogRepository: Repository<PipeLineDeployLogEntity>,
  ) {}

  public async findPipeLine(id: number): Promise<PipeLineEntity> {
    return this.pipeLineRepository.findOne(id);
  }

  public async findPipeLines(): Promise<PipeLineEntity[]> {
    return this.pipeLineRepository.find();
  }

  public async findPipeLineDeploys(id: number): Promise<PipeLineDeployLogEntity[]> {
    const deploys = this.pipeLineDeployLogRepository.find({
      where: { pipeline_id: id }
    })

    return deploys;
  }

  public async createPipeLine(
    dto: CreatePipeLineRequestDto,
  ): Promise<PipeLineEntity> {
    return this.pipeLineRepository.save(dto);
  }
}
