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
    private readonly pipeLineDeployLogRepository: Repository<
      PipeLineDeployLogEntity
    >,
  ) {}

  public async findPipeLine(id: number): Promise<PipeLineEntity> {
    const pipeline = await this.pipeLineRepository
      .createQueryBuilder('pp')
      .where('pp.id = :id', { id })
      .leftJoinAndMapOne('pp.project', 'project', 'p', 'p.id = pp.project_id')
      .getOne();

    return pipeline;
  }

  public async findPipeLines(): Promise<PipeLineEntity[]> {
    const pipelines = await this.pipeLineRepository
      .createQueryBuilder('pp')
      .leftJoinAndMapOne('pp.project', 'project', 'p', 'p.id = pp.project_id')
      .getMany();

    return pipelines;
  }

  public async findPipeLineDeploys(
    id: number,
  ): Promise<PipeLineDeployLogEntity[]> {
    const deploys = this.pipeLineDeployLogRepository.find({
      where: { pipeline_id: id },
    });

    return deploys;
  }

  public async createPipeLine(
    dto: CreatePipeLineRequestDto,
  ): Promise<PipeLineEntity> {
    return this.pipeLineRepository.save(dto);
  }
}
