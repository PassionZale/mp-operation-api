import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiException } from '@src/filter/api-exception.filter';
import { DownloadRequestDto } from '../dto/request/download.request.dto';
import { PipeLineDeployLogEntity } from '../entity/pipeline-deploy-log.entity';
import { CreateDeployLogRequestDto } from '../dto/request/create-deploy-log.request.dto';

@Injectable()
export class PipeLineDeployService {
  constructor(
    @InjectRepository(PipeLineDeployLogEntity)
    private readonly pipeLineDeployLogRepository: Repository<
      PipeLineDeployLogEntity
    >,
  ) {}

  public async findOne(id: string): Promise<any> {
    const pipeLineDeploy = await this.pipeLineDeployLogRepository
      .createQueryBuilder('pipeline_deploy_log')
      .leftJoinAndMapOne(
        'pipeline_deploy_log.user',
        'user',
        'u',
        'u.id = pipeline_deploy_log.user_id',
      )
      .where('pipeline_deploy_log.id = :id', { id })
      .getOne();

    return pipeLineDeploy;
  }

  public async findAll(): Promise<PipeLineDeployLogEntity[]> {
    const pipeLineDeploys = await this.pipeLineDeployLogRepository
      .createQueryBuilder('pipeline_deploy_log')
      .leftJoinAndMapOne(
        'pipeline_deploy_log.user',
        'user',
        'u',
        'u.id = pipeline_deploy_log.user_id',
      )
      .getMany();

    return pipeLineDeploys;
  }

  public async create(
    dto: CreateDeployLogRequestDto,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployLogRepository.save(dto);
  }

  public async getDeployInfo(
    dto: DownloadRequestDto,
  ): Promise<PipeLineDeployLogEntity> {
    const deploy = await this.pipeLineDeployLogRepository
      .createQueryBuilder('pdl')
      .where('pdl.id = :id', { id: dto.deploy_id })
      .andWhere('pdl.pipeline_id = :pipeline_id', {
        pipeline_id: dto.pipeline_id,
      })
      .leftJoinAndMapOne(
        'pdl.pipeline',
        'pipeline',
        'p',
        'p.id = pdl.pipeline_id',
      )
      .getOne();

    if (!deploy) throw new ApiException('无法查询所指定的部署记录');

    return deploy;
  }
}
