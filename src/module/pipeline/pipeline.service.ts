import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PipeLineEntity } from './entity/pipeline.entity';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';
import { PipeLineDeployLogEntity } from './entity/pipeline-deploy-log.entity';
import { IPipeLineDeployDto } from './pipeline.interface';

@Injectable()
export class PipeLineService {
  constructor(
    @InjectRepository(PipeLineEntity)
    private readonly pipeLineEntity: Repository<PipeLineEntity>,
    @InjectRepository(PipeLineDeployLogEntity)
    private readonly pipeLineDeployLogEntity: Repository<PipeLineDeployLogEntity>,
  ) {}

  public async findPipeLine(id: string): Promise<PipeLineEntity> {
    return this.pipeLineEntity.findOne(id, {
      relations: ['user', 'pipeline_deploy_logs'],
    });
  }

  public async findPipeLines(): Promise<PipeLineEntity[]> {
    return this.pipeLineEntity.find({ relations: ['user'] });
  }

  public async createPipeLine(dto: CreatePipeLineRequestDto): Promise<PipeLineEntity> {
    return this.pipeLineEntity.save(dto);
  }

  public async deploy(dto: IPipeLineDeployDto): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployLogEntity.save(dto);
  }
}
