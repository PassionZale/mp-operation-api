import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from 'fs';

import { AppConfigService } from "@src/config/app/config.service";
import { ApiException } from "@src/filter/api-exception.filter";
import { DownloadRequestDto } from "./dto/request/download.request.dto";
import { PipeLineDeployLogEntity } from "./entity/pipeline-deploy-log.entity";
import { CreateDeployLogRequestDto } from "./dto/request/create-deploy-log.request.dto";

@Injectable()
export class PipeLineDeployService {
  constructor(
    @InjectRepository(PipeLineDeployLogEntity)
    private readonly pipeLineDeployLogRepository: Repository<
      PipeLineDeployLogEntity
    >,
    private readonly appConfigSerivce: AppConfigService,
  ) {}

  public async findOne(id: number): Promise<any> {
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

  public async findAll(): Promise<PipeLineDeployLogEntity[]> {
    const pipeLineDeploys = await this.pipeLineDeployLogRepository
      .createQueryBuilder('pipeline_deploy_log')
      .leftJoinAndMapOne(
        'pipeline_deploy_log.user',
        'user',
        'user',
        'user.id = pipeline_deploy_log.user_id',
      )
      .getMany();

    return pipeLineDeploys;
  }

  public async create(
    dto: CreateDeployLogRequestDto,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployLogRepository.save(dto);
  }

  public async getFileFullPath(dto: DownloadRequestDto): Promise<string> {
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