import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PipeLineEntity } from './entity/pipeline.entity';
import { PipeLineDeployLogEntity } from './entity/pipeline-deploy-log.entity';
import {
  CreateDeployLogServiceDto,
  CreatePipeLineServiceDto,
} from './pipeline.interface';

@Injectable()
export class PipeLineService {
  constructor(
    @InjectRepository(PipeLineEntity)
    private readonly pipeLineEntity: Repository<PipeLineEntity>,
    @InjectRepository(PipeLineDeployLogEntity)
    private readonly pipeLineDeployLogEntity: Repository<
      PipeLineDeployLogEntity
    >,
  ) {}

  public async findPipeLine(id: string): Promise<PipeLineEntity> {
    return this.pipeLineEntity.findOne(id);
  }

  public async findPipeLines(): Promise<PipeLineEntity[]> {
    return this.pipeLineEntity.find();
  }

  public async findPipeLineDeploy(id: number): Promise<any> {
    const pipeLineDeploy = await this.pipeLineDeployLogEntity
      .createQueryBuilder('pipeline_deploy_log')
      .leftJoinAndMapOne('pipeline_deploy_log.deployer', 'user', 'user', 'user.id = pipeline_deploy_log.deployed_by')
      .where('pipeline_deploy_log.id = :id', { id })
      .getOne();

    return pipeLineDeploy;
  }

  public async createPipeLine(
    dto: CreatePipeLineServiceDto,
  ): Promise<PipeLineEntity> {
    return this.pipeLineEntity.save(dto);
  }

  public async deployPipeLine(
    dto: CreateDeployLogServiceDto,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployLogEntity.save(dto);
  }
}
