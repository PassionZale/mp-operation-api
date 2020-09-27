import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as moment from 'moment-timezone';

import { ApiException } from '@src/filter/api-exception.filter';
import { DownloadRequestDto } from '../dto/request/download.request.dto';
import { PipeLineDeployLogEntity } from '../entity/pipeline-deploy-log.entity';
import { CreateDeployLogRequestDto } from '../dto/request/create-deploy-log.request.dto';
import { UpdateDeployLogRequestDto } from '../dto/request/update-deploy-log.request.dto';

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
      .leftJoinAndMapOne(
        'pipeline_deploy_log.pipeline',
        'pipeline',
        'p',
        'p.id = pipeline_deploy_log.pipeline_id',
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
      .leftJoinAndMapOne(
        'pipeline_deploy_log.pipeline',
        'pipeline',
        'p',
        'p.id = pipeline_deploy_log.pipeline_id',
      )
      .getMany();

    return pipeLineDeploys;
  }

  public async create(
    dto: CreateDeployLogRequestDto,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployLogRepository.save(dto);
  }

  public async update(
    id: string,
    dto: UpdateDeployLogRequestDto,
  ): Promise<boolean> {
    const deployed_at = (moment().format() as unknown) as Date;

    const pipelineDeploy = await this.findOne(id);

    if (!pipelineDeploy) throw new ApiException('部署记录不存在');

    const updateResult: UpdateResult = await this.pipeLineDeployLogRepository.update(
      id,
      { ...dto, deployed_at },
    );

    return !!updateResult.affected;
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
