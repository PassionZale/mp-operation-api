import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class LoginRequestDto {
  @IsNumber({}, { message: '工号必须为数字' })
  @IsNotEmpty({ message: '工号不能为空' })
  readonly job_number: number;

  @IsString({ message: '密码必须为字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}
