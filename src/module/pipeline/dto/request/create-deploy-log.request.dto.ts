import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateDeployLogRequestDto {
  @IsUUID(4, { message: '流水线序号格式有误，应为 uuid v4' })
  @IsNotEmpty({ message: '流水线序号不能为空' })
  readonly pipeline_id: string;

  @IsNotEmpty({ message: '描述不能为空' })
  readonly desc: string;

  @IsNotEmpty({ message: '部署文件路径不能为空' })
  readonly project_path: string;

  @IsOptional()
  readonly user_id?: number;
}
