import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateProjectRequestDto } from './dto/request/create-project.request.dto';
import { EditProjectRequestDto } from './dto/request/edit-project.request.dto';

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

  public async update(id: number, dto: EditProjectRequestDto): Promise<boolean> {
    const updateResult: UpdateResult = await this.projectRepository.update(id, dto);

    return !!updateResult.affected;;
  }
}
