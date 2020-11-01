import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
  ClassSerializerInterceptor,
  Query,
  Put,
} from '@nestjs/common';
import { PipeLineService } from '../service/pipeline.service';
import { PipeLineEntity } from '../entity/pipeline.entity';
import { CreatePipeLineRequestDto } from '../dto/request/create-pipeline.request.dto';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';
import { RequestUser } from '@src/common/decorator/request-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { getPipelineMulterOptions } from '@src/config/multer/configuration';
import { ApiException } from '@src/filter/api-exception.filter';
import { removeForwardSlash } from '@src/common/helper/path.helper';
import { desensitization } from '@src/common/helper/sensitive.helper';
import { PipeLineDeployLogEntity } from '../entity/pipeline-deploy-log.entity';
import { SelectPipeLineRequestDto } from '../dto/request/select-pipelines.request.dot';
import { UpdatePipeLineRequestDto } from '../dto/request/update-pipeline.request.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class PipeLineController {
  constructor(private readonly pipeLineService: PipeLineService) {}

  /**
   * 获取流水线部署记录列表
   * @param id 
   */
  @Get('pipeline/:id/deploys')
  public async findPipeLineDeploys(
    @Param('id') id: number,
  ): Promise<PipeLineDeployLogEntity[]> {
    return this.pipeLineService.findPipeLineDeploys(id);
  }

  /**
   * 获取流水线最新的一条部署记录
   * @param id 
   */
  @Get('pipeline/:id/latest/deploy')
  public async findPipeLineDeploy(
    @Param('id') id: number,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineService.findPipeLineLatestDeploy(id);
  }

  /**
   * 查询指定流水线
   * @param id
   */
  @Get('pipeline/:id')
  public async findPipeLine(@Param('id') id: number): Promise<PipeLineEntity> {
    return this.pipeLineService.findPipeLine(id);
  }

  /**
   * 查询流水线列表
   */
  @Get('pipelines')
  public async findPipeLines( @Query() query: SelectPipeLineRequestDto,
     ): Promise<PipeLineEntity[]> {
    console.log(query);
    return this.pipeLineService.findPipeLines(query);
  }

  /**
   * 创建流水线
   * @param created_by
   * @param body
   */
  @Post('pipeline')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  public async createPipeLine(
    @RequestUser('id') user_id: number,
    @Body() body: CreatePipeLineRequestDto,
  ): Promise<PipeLineEntity> {
    const pipeLine = await this.pipeLineService.createPipeLine({
      ...body,
      user_id,
    });

    const { private_key } = pipeLine;

    // 脱敏返回 private_key
    pipeLine.private_key = desensitization(private_key);

    return pipeLine;
  }

  /**
   * 修改流水线
   * @param created_by
   * @param body
   */
  @Put('pipeline/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.ADMIN)
  public async updatePipeLine(
    @RequestUser('id') user_id: number,
    @Param('id') id: number,
    @Body() body: UpdatePipeLineRequestDto,
  ): Promise<boolean> {
    return this.pipeLineService.updatePipeLine(id, { ...body, user_id });
  }

  /**
   * 上传流水线压缩包
   * @param created_by
   * @param body
   */
  @Post('pipeline/upload')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  @UseInterceptors(FileInterceptor('file', getPipelineMulterOptions()))
  public async uploadDeploy(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    if (file === undefined) {
      throw new ApiException('上传文件不能为空');
    }

    const filepath = removeForwardSlash(file.path);

    return filepath;
  }
}
