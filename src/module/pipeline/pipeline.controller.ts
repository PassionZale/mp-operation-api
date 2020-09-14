import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PipeLineService } from './pipeline.service';
import { PipeLineEntity } from './entity/pipeline.entity';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';
import { IRequestUser } from '@src/common/interface/request-user.interface';
import { RequestUser } from '@src/common/decorator/request-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { getPipelineMulterOptions } from '@src/config/multer/configuration';
import { CreateDeployLogRequestDto } from './dto/request/create-deploy-log.request.dto';
import { PipeLineDeployLogEntity } from './entity/pipeline-deploy-log.entity';

@Controller()
export class PipeLineController {
  constructor(private readonly pipeLineService: PipeLineService) {}

  @Get('pipeline/:id')
  public async findPipeLine(@Param('id') id: string): Promise<PipeLineEntity> {
    return this.pipeLineService.findPipeLine(id);
  }

  @Get('pipelines')
  public async findPipeLines(): Promise<PipeLineEntity[]> {
    return this.pipeLineService.findPipeLines();
  }

  @Post('pipeline')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  public async createPipeLine(
    @RequestUser() user: IRequestUser,
    @Body() body: CreatePipeLineRequestDto,
  ): Promise<PipeLineEntity> {
    return this.pipeLineService.createPipeLine({ ...body, user });
  }

  // @Post('pipeline/:id/deploy')
  // public async deployPipeLine(): Promise<PipeLineDeployLogEntity> {

  // }

  @Post('pipeline/:id/deploy/upload')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  @UseInterceptors(FileInterceptor('file', getPipelineMulterOptions()))
  public async uploadDeploy(
    @Body() body: CreateDeployLogRequestDto,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PipeLineDeployLogEntity> {
    const pipeline = { id };

    const dto = { pipeline, ...body, project_path: file.path };

    return this.pipeLineService.deploy(dto);
  }
}
