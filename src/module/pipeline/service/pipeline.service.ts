import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as moment from 'moment-timezone';

import { PipeLineEntity } from '../entity/pipeline.entity';
import { CreatePipeLineRequestDto } from '../dto/request/create-pipeline.request.dto';
import { PipeLineDeployLogEntity } from '../entity/pipeline-deploy-log.entity';
import { SelectPipeLineRequestDto } from '../dto/request/select-pipelines.request.dot';
import { UpdatePipeLineRequestDto } from '../dto/request/update-pipeline.request.dto';
import { ApiException } from '@src/filter/api-exception.filter';

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

  public async findPipeLines(
    query: SelectPipeLineRequestDto,
  ): Promise<PipeLineEntity[]> {
    const { project_id } = query;

    const db = this.pipeLineRepository
      .createQueryBuilder('pp')
      .leftJoinAndMapOne('pp.project', 'project', 'p', 'p.id = pp.project_id');

    if (project_id) {
      db.where('pp.project_id = :project_id', { project_id });
    }

    const pipelines = await db.getMany();

    return pipelines;
  }

  public async findPipelinesAndDeploy(
    project_id: number,
  ): Promise<PipeLineEntity[]> {
    const db = this.pipeLineRepository.createQueryBuilder('p');

    db.where('p.project_id = :project_id', { project_id })
      .leftJoinAndMapOne(
        'p.deploy',
        'pipeline_deploy_log',
        'pd',
        'pd.pipeline_id = p.id',
      )
      .leftJoinAndMapOne('pd.user', 'user', 'u', 'u.id = pd.user_id')
      .orderBy('pd.deployed_at', 'DESC')
      .getOne();

    // leftJoinAndMapOne 子查询，无法映射 entity 中的 property，因此下方写法无效
    // https://github.com/typeorm/typeorm/issues/5637#issuecomment-699726742
    // db.where('p.project_id = :project_id', { project_id })
    //   .leftJoinAndMapOne(
    //     'p.deploy',
    //     subQuery => {
    //       return subQuery
    //         .select()
    //         .from(PipeLineDeployLogEntity, 'pd')
    //         .orderBy({'pd.deployed_at': 'DESC'});
    //     },
    //     'pd',
    //     'pd.pipeline_id = p.id',
    //   )
    //   .orderBy('p.id', 'ASC')
    //   .getOne();

    const pipelines = await db.getMany();

    // 由于上面的 BUG ，查询完毕后，手动按照 p.id 进行 ASC 排序
    return pipelines.sort((a, b) => a.id - b.id);
  }

  public async updatePipeLine(
    id: number,
    dto: UpdatePipeLineRequestDto,
  ): Promise<boolean> {
    const updated_at = (moment().format() as unknown) as Date;

    const pipeline = await this.findPipeLine(id);

    if (!pipeline) throw new ApiException('流水线不存在');

    const updateResult: UpdateResult = await this.pipeLineRepository.update(
      id,
      { ...dto, updated_at },
    );

    return !!updateResult.affected;
  }

  public async findPipeLineLatestDeploy(
    id: number,
  ): Promise<PipeLineDeployLogEntity> {
    const deploy = await this.pipeLineDeployLogRepository
      .createQueryBuilder('pdl')
      .leftJoinAndMapOne('pdl.user', 'user', 'u', 'u.id = pdl.user_id')
      .where('pdl.pipeline_id = :id', { id })
      .orderBy('pdl.deployed_at', 'DESC')
      .getOne();

    return deploy;
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
