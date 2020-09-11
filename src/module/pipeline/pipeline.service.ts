import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PipeLineEntity } from './entity/pipeline.entity';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';

@Injectable()
export class PipeLineService {
  constructor(
    @InjectRepository(PipeLineEntity)
    private readonly pipeLineEntity: Repository<PipeLineEntity>,
  ) {}

  public async findAll(): Promise<PipeLineEntity[]> {
    return this.pipeLineEntity.find();
  }

  public async create(dto: CreatePipeLineRequestDto): Promise<PipeLineEntity> {
    return this.pipeLineEntity.create(dto);
  }
}
