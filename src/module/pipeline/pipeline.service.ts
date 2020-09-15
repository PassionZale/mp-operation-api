import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PipeLineEntity } from './entity/pipeline.entity';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';

@Injectable()
export class PipeLineService {
  constructor(
    @InjectRepository(PipeLineEntity)
    private readonly pipeLineRepository: Repository<PipeLineEntity>,
  ) {}

  public async findPipeLine(id: string): Promise<PipeLineEntity> {
    return this.pipeLineRepository.findOne(id);
  }

  public async findPipeLines(): Promise<PipeLineEntity[]> {
    return this.pipeLineRepository.find();
  }

  public async createPipeLine(
    dto: CreatePipeLineRequestDto,
  ): Promise<PipeLineEntity> {
    return this.pipeLineRepository.save(dto);
  }
}
