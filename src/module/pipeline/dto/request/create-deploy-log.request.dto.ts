import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDeployLogRequestDto {
  @IsNotEmpty({ message: '流水线不能为空' })
  readonly pipeline_id: number;

  @IsNotEmpty({ message: '版本号不能为空' })
  readonly version: string;

  @IsNotEmpty({ message: '描述不能为空' })
  readonly desc: string;

  @IsNotEmpty({ message: '部署文件路径不能为空' })
  readonly project_path: string;

  @IsOptional()
  readonly user_id?: number;
}
