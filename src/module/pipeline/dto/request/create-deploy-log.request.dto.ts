import { IsNotEmpty } from "class-validator";

export class CreateDeployLogRequestDto {
  @IsNotEmpty({ message: '描述不能为空' })
  readonly desc: string
}