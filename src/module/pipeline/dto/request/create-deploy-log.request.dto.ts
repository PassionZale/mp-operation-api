import { IsNotEmpty } from 'class-validator';

export class CreateDeployLogRequestDto {
  @IsNotEmpty({ message: '描述不能为空' })
  readonly desc: string;

  @IsNotEmpty({ message: '部署文件路径不能为空' })
  readonly project_path: string;
}
