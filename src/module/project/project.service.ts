import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PipeLineEntity } from '../pipeline/entity/pipeline.entity';
import { CreateProjectRequestDto } from './dto/request/create-project.request.dto';
import { UpdateProjectRequestDto } from './dto/request/update-project.request.dto';

import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  public async create(dto: CreateProjectRequestDto): Promise<ProjectEntity> {
    const project = await this.projectRepository.save(dto);

    return project;
  }

  public async findOne(id: number): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne(id);

    return project;
  }

  public async findAll(): Promise<ProjectEntity[]> {
    const projects = await this.projectRepository.find();

    return projects;
  }

  public async update(
    id: number,
    dto: UpdateProjectRequestDto,
  ): Promise<boolean> {
    const updateResult: UpdateResult = await this.projectRepository.update(
      id,
      dto,
    );

    return !!updateResult.affected;
  }

  public async findProjectPipeLineTree(): Promise<ProjectEntity[]> {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .select(['project.id', 'project.name', 'project.desc'])
      .leftJoinAndMapMany(
        'project.pipelines',
        'pipeline',
        'pipeline',
        'pipeline.project_id = project.id'
      )
      // .leftJoinAndMapMany(
      //   'project.pipelines',
      //   qb => {
      //     return qb
      //       .select(['p.id', 'p.project_id', 'p.name', 'p.desc'])
      //       .from(PipeLineEntity, 'p');
      //   },
      //   'pipelines',
      //   'pipelines.`p_project_id` = project.id',
      // )
      .getMany();

    return projects;
  }
}
