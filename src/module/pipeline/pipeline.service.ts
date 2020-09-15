import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';

import { PipeLineEntity } from './entity/pipeline.entity';
import { PipeLineDeployLogEntity } from './entity/pipeline-deploy-log.entity';
import {
  CreateDeployLogServiceDto,
  CreatePipeLineServiceDto,
} from './pipeline.interface';
import { DownloadRequestDto } from './dto/request/download.request.dto';
import { ApiException } from '@src/filter/api-exception.filter';
import { AppConfigService } from '@src/config/app/config.service';

@Injectable()
export class PipeLineService {
  constructor(
    @InjectRepository(PipeLineEntity)
    private readonly pipeLineRepository: Repository<PipeLineEntity>,
    @InjectRepository(PipeLineDeployLogEntity)
    private readonly pipeLineDeployLogRepository: Repository<
      PipeLineDeployLogEntity
    >,
    private readonly appConfigSerivce: AppConfigService,
  ) {}

  public async findPipeLine(id: string): Promise<PipeLineEntity> {
    return this.pipeLineRepository.findOne(id);
  }

  public async findPipeLines(): Promise<PipeLineEntity[]> {
    return this.pipeLineRepository.find();
  }

  public async findPipeLineDeploys(): Promise<PipeLineDeployLogEntity[]> {
    const pipeLineDeploys = await this.pipeLineDeployLogRepository
      .createQueryBuilder('pipeline_deploy_log')
      .leftJoinAndMapOne(
        'pipeline_deploy_log.user',
        'user',
        'user',
        'user.id = pipeline_deploy_log.user_id',
      )
      .getMany();

    console.log(pipeLineDeploys)
    return pipeLineDeploys;
  }

  public async findPipeLineDeploy(id: number): Promise<any> {
    const pipeLineDeploy = await this.pipeLineDeployLogRepository
      .createQueryBuilder('pipeline_deploy_log')
      .leftJoinAndMapOne(
        'pipeline_deploy_log.user',
        'user',
        'user',
        'user.id = pipeline_deploy_log.user_id',
      )
      .where('pipeline_deploy_log.id = :id', { id })
      .getOne();

    return pipeLineDeploy;
  }

  public async createPipeLine(
    dto: CreatePipeLineServiceDto,
  ): Promise<PipeLineEntity> {
    return this.pipeLineRepository.save(dto);
  }

  public async deployPipeLine(
    dto: CreateDeployLogServiceDto,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployLogRepository.save(dto);
  }

  public async getDeployProjectPath(dto: DownloadRequestDto): Promise<string> {
    const deploy = await this.pipeLineDeployLogRepository
      .createQueryBuilder('pipeline_deploy_log')
      .where('pipeline_deploy_log.id = :id', { id: dto.deploy_id })
      .andWhere('pipeline_deploy_log.pipeline_id = :pipeline_id', {
        pipeline_id: dto.pipeline_id,
      })
      .getOne();

    if (!deploy) throw new ApiException('无法查询所指定的部署记录');

    const root = this.appConfigSerivce.url;
    const { project_path } = deploy;

    try {
      await fs.promises.access(project_path);

      return `${root}/${project_path}`;
    } catch (error) {
      throw new ApiException('部署文件不存在');
    }
  }
}
