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
} from '@nestjs/common';
import { PipeLineService } from './pipeline.service';
import { PipeLineEntity } from './entity/pipeline.entity';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';
import { RequestUser } from '@src/common/decorator/request-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { getPipelineMulterOptions } from '@src/config/multer/configuration';
import { CreateDeployLogRequestDto } from './dto/request/create-deploy-log.request.dto';
import { PipeLineDeployLogEntity } from './entity/pipeline-deploy-log.entity';
import { ApiException } from '@src/filter/api-exception.filter';
import { removeForwardSlash } from '@src/common/helper/path.helper';
import { desensitization } from '@src/common/helper/sensitive.helper';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class PipeLineController {
  constructor(private readonly pipeLineService: PipeLineService) {}

  /**
   * 查询指定流水线
   * @param id
   */
  @Get('pipeline/:id')
  public async findPipeLine(@Param('id') id: string): Promise<PipeLineEntity> {
    return this.pipeLineService.findPipeLine(id);
  }

  /**
   * 查询流水线列表
   */
  @Get('pipelines')
  public async findPipeLines(): Promise<PipeLineEntity[]> {
    return this.pipeLineService.findPipeLines();
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

  /**
   * 查询日志记录
   * @param id 
   */
  @Get('pipeline/deploy/:id')
  public async findPipeLineDeploy(@Param('id') id: number): Promise<any> {
    return this.pipeLineService.findPipeLineDeploy(id)
  }

  /**
   * 部署流水线
   * @param body
   */
  @Post('pipeline/:id/deploy')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  public async deployPipeLine(
    @RequestUser('id') user_id: number,
    @Param('id') pipeline_id: string,
    @Body() body: CreateDeployLogRequestDto,
  ): Promise<PipeLineDeployLogEntity> {
    return this.pipeLineService.deployPipeLine({
      ...body,
      user_id,
      pipeline_id,
    });
  }
}
