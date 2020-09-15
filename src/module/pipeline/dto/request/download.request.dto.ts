import { IsNotEmpty, IsUUID } from 'class-validator';

export class DownloadRequestDto {

  deploy_id: number
  @IsUUID(4, { message: '流水线序号格式有误，应为 uuid v4' })
  @IsNotEmpty({ message: '流水线序号不能为空' })
  readonly pipeline_id: string;

  @IsNotEmpty({ message: '部署日志 ID 不能为空' })
  readonly deoloy_id: number;
}