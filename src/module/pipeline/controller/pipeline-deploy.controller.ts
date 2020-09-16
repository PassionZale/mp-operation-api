import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment-timezone';

import { RequestUser } from '@src/common/decorator/request-user.decorator';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { CreateDeployLogRequestDto } from '../dto/request/create-deploy-log.request.dto';
import { DownloadRequestDto } from '../dto/request/download.request.dto';
import { PipeLineDeployLogEntity } from '../entity/pipeline-deploy-log.entity';
import { PipeLineDeployService } from '../service/pipeline-deploy.service';
import { ApiException } from '@src/filter/api-exception.filter';
import { FILE_NAME_FORMAT } from '@src/common/constant/format.constant';

@Controller()
export class PipeLineDeployController {
  constructor(private readonly pipeLineDeployService: PipeLineDeployService) {}

  /**
   * 部署记录列表
   */
  @Get('pipeline-deploys')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  public async findPipeLineDeploys(): Promise<PipeLineDeployLogEntity[]> {
    return this.pipeLineDeployService.findAll();
  }

  /**
   * 下载部署文件
   */
  @Get('pipeline-deploy/download')
  public async downloadPipeline(
    @Res() res: Response,
    @Query() query: DownloadRequestDto,
  ): Promise<any> {
    const deploy = await this.pipeLineDeployService.getDeployInfo(query);

    const {
      pipeline: { name },
      pipeline_id,
      deployed_at,
      project_path,
    } = deploy;

    res.download(
      project_path,
      `${name}-${moment(deployed_at).format(
        FILE_NAME_FORMAT,
      )}-${pipeline_id}.zip`,
      (error: Error): void => {
        if (error) {
          throw new ApiException(error.message);
        }
      },
    );
  }

  /**
   * 部署记录
   * @param id
   */
  @Get('pipeline-deploy/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  public async findPipeLineDeploy(
    @Param('id') id: number,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployService.findOne(id);
  }

  /**
   * 创建部署记录
   * @param body
   */
  @Post('pipeline-deploy')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  public async createPipeLineDeploy(
    @RequestUser('id') user_id: number,
    @Body() body: CreateDeployLogRequestDto,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployService.create({
      ...body,
      user_id,
    });
  }
}
