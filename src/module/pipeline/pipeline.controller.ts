import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PipeLineService } from './pipeline.service';
import { PipeLineEntity } from './entity/pipeline.entity';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';

@Controller()
export class PipeLineController {
  constructor(private readonly pipeLineService: PipeLineService) {}

  @Get('pipelines')
  public async findAll(): Promise<PipeLineEntity[]> {
    return this.pipeLineService.findAll();
  }

  @Post('pipeline')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  public async create(@Body() body: CreatePipeLineRequestDto): Promise<PipeLineEntity> {
    return this.pipeLineService.create(body)
  }
}
