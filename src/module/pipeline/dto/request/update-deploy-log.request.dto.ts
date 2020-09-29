import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDeployLogRequestDto {
  @IsNotEmpty({ message: '描述不能为空' })
  readonly desc: string;

  @IsNotEmpty({ message: '部署文件路径不能为空' })
  readonly project_path: string;

  @IsOptional()
  readonly user_id?: number;
}
