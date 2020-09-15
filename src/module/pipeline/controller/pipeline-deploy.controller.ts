import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { RequestUser } from '@src/common/decorator/request-user.decorator';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { CreateDeployLogRequestDto } from '../dto/request/create-deploy-log.request.dto';
import { DownloadRequestDto } from '../dto/request/download.request.dto';
import { PipeLineDeployLogEntity } from '../entity/pipeline-deploy-log.entity';
import { PipeLineDeployService } from '../service/pipeline-deploy.service';

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
  public async downloadPipeline(@Query() query: DownloadRequestDto): Promise<any> {
    const filepath = await this.pipeLineDeployService.getFileFullPath(query)

    return filepath;
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
  public async deployPipeLine(
    @RequestUser('id') user_id: number,
    @Body() body: CreateDeployLogRequestDto,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineDeployService.create({
      ...body,
      user_id,
    });
  }
}
