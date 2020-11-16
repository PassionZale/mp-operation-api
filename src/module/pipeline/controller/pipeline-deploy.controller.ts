import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Res,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment-timezone';
import * as fs from 'fs';

import { RequestUser } from '@src/common/decorator/request-user.decorator';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { CreateDeployLogRequestDto } from '../dto/request/create-deploy-log.request.dto';
import { UpdateDeployLogRequestDto } from '../dto/request/update-deploy-log.request.dto';
import { DownloadRequestDto } from '../dto/request/download.request.dto';
import { PipeLineDeployLogEntity } from '../entity/pipeline-deploy-log.entity';
import { PipeLineDeployService } from '../service/pipeline-deploy.service';
import { FILE_NAME_FORMAT } from '@src/common/constant/format.constant';
import { Mime } from '@src/common/enum/mime.enum';
import { Stream } from 'stream';
import { ApiException } from '@src/filter/api-exception.filter';

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
    @Res() response: Response,
    @Query() query: DownloadRequestDto,
  ): Promise<Stream> {
    const deploy = await this.pipeLineDeployService.getDeployInfo(query);

    const {
      pipeline: { name },
      pipeline_id,
      deployed_at,
      project_path,
    } = deploy;

    try {
      await fs.promises.access(project_path, fs.constants.R_OK);

      const filename = `${name}-${moment(deployed_at).format(
        FILE_NAME_FORMAT,
      )}-${pipeline_id}.zip`;

      response.setHeader('Content-type', Mime.zip);
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}`,
      );
      return fs.createReadStream(project_path).pipe(response);
    } catch (error) {
      throw new ApiException('文件无法被读取');
    }
  }

  /**
   * 部署记录
   * @param id
   */
  @Get('pipeline-deploy/:id')
  public async findPipeLineDeploy(
    @Param('id') id: string,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployService.findOne(id);
  }

  /**
   * 更新部署记录
   */
  @Put('pipeline-deploy/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  public async updatePipeLineDeploy(
    @Param('id') id: string,
    @RequestUser('id') user_id: number,
    @Body() body: UpdateDeployLogRequestDto,
  ): Promise<boolean> {
    return this.pipeLineDeployService.update(id, { ...body, user_id });
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
