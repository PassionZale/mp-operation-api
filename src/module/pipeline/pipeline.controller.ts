import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PipeLineService } from './pipeline.service';
import { PipeLineEntity } from './entity/pipeline.entity';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';
import { IRequestUser } from '@src/common/interface/request-user.interface';
import { RequestUser } from '@src/common/decorator/request-user.decorator';

@Controller()
export class PipeLineController {
  constructor(private readonly pipeLineService: PipeLineService) {}

  @Get('pipeline/:id')
  public async findOne(@Param() id: number): Promise<PipeLineEntity> {
    return this.pipeLineService.findOne(id);
  }

  @Get('pipelines')
  public async findAll(): Promise<PipeLineEntity[]> {
    return this.pipeLineService.findAll();
  }

  @Post('pipeline')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  public async create(
    @RequestUser() user: IRequestUser,
    @Body() body: CreatePipeLineRequestDto,
  ): Promise<PipeLineEntity> {
    return this.pipeLineService.create({ ...body, user });
  }
}
