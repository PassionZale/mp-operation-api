import { IsNotEmpty, IsUUID } from 'class-validator';

export class DownloadRequestDto {
  @IsNotEmpty({ message: '流水线不能为空' })
  readonly pipeline_id: number;

  @IsUUID(4, { message: '部署日志参数不合法' })
  @IsNotEmpty({ message: '部署日志不能为空' })
  readonly deploy_id: string;
}