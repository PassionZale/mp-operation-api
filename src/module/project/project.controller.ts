import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestUser } from '@src/common/decorator/request-user.decorator';

import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';
import { removeForwardSlash } from '@src/common/helper/path.helper';
import { getPublicMulterOptions } from '@src/config/multer/configuration';
import { ApiException } from '@src/filter/api-exception.filter';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { CreateProjectRequestDto } from './dto/request/create-project.request.dto';
import { UpdateProjectRequestDto } from './dto/request/update-project.request.dto';
import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('project/upload')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  @UseInterceptors(FileInterceptor('file', getPublicMulterOptions()))
  public async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    if (file === undefined) {
      throw new ApiException('上传文件不能为空');
    }

    const filepath = removeForwardSlash(file.path);

    return filepath;
  }

  @Post('project')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  public async create(
    @RequestUser('id') user_id: number,
    @Body() body: CreateProjectRequestDto,
  ): Promise<ProjectEntity> {
    const project = await this.projectService.create({ user_id, ...body });

    return project;
  }

  @Put('project/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.DEVELOPER)
  public async update(
    @Param() id: number,
    @Body() body: UpdateProjectRequestDto,
  ): Promise<boolean> {
    const project = await this.projectService.findOne(id);

    if (!project) throw new ApiException('项目不存在');

    return this.projectService.update(id, body);
  }

  @Get('project/pipeline/tree')
  public async findProjectPipeLineTree(): Promise<ProjectEntity[]> {
    const treeData = await this.projectService.findProjectPipeLineTree();
    
    return treeData;
  }

  @Get('project/:id')
  public async findOne(@Param() id: number): Promise<ProjectEntity> {
    const project = await this.projectService.findOne(id);

    if (!project) throw new ApiException('项目不存在');

    return project;
  }

  @Get('projects')
  public async findAll(): Promise<ProjectEntity[]> {
    const projects = await this.projectService.findAll();

    return projects;
  }
}
