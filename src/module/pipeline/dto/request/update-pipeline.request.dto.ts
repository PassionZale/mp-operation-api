import { MaxLength, IsOptional, IsIn } from 'class-validator';
import { PipeLineTypes } from '@src/common/enum/pipeline.enum';

export class UpdatePipeLineRequestDto {
  @MaxLength(100, { message: '名称长度较大，最大长度为 $constraint1 字符' })
  @IsOptional()
  readonly name: string;

  @MaxLength(100, { message: 'APPID 长度较大，最大长度为 $constraint1 字符' })
  @IsOptional()
  readonly appid: string;

  @IsOptional()
  readonly desc: string;

  @IsIn(
    [
      PipeLineTypes.MINI_GAME,
      PipeLineTypes.MINI_GAME_PLUGIN,
      PipeLineTypes.MINI_PROGRAM,
      PipeLineTypes.MINI_PROGRAM_PLUGIN,
    ],
    { message: '类型不存在' },
  )
  @IsOptional()
  readonly type?: PipeLineTypes;

  @IsOptional()
  private_key?: string;

  @IsOptional()
  user_id?: number;
}
