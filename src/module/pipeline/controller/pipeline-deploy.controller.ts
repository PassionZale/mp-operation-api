import { Body, Controller, Get, Param, Post, Query, UseGuards, Res, NotFoundException } from '@nestjs/common';
import { RequestUser } from '@src/common/decorator/request-user.decorator';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { CreateDeployLogRequestDto } from '../dto/request/create-deploy-log.request.dto';
import { DownloadRequestDto } from '../dto/request/download.request.dto';
import { PipeLineDeployLogEntity } from '../entity/pipeline-deploy-log.entity';
import { PipeLineDeployService } from '../service/pipeline-deploy.service';
import { Mime } from '@src/common/enum/mime.enum';
import { Response } from 'express';
import * as fs from 'fs';

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
  public async downloadPipeline(@Res() response: Response, @Query() query: DownloadRequestDto): Promise<any> {
    const filePath = await this.pipeLineDeployService.getProjectPath(query);

    const stats = fs.statSync(filePath); 

    if(stats.isFile()) {
      response.setHeader('Content-type', Mime.zip);
      // TODO 动态组装名称
      response.setHeader('Content-Disposition', `attachment; filename=deploy.zip`);
      response.setHeader('Content-Length', stats.size)
      return fs.createReadStream(filePath).pipe(response);
    } else {
      throw new NotFoundException();
    }
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
