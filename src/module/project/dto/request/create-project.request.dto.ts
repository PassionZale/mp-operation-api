import { IsNotEmpty } from "class-validator";

export class CreateProjectRequestDto {
  @IsNotEmpty({ message: "项目名不能为空" })
  name: string;

  @IsNotEmpty({ message: "项目描述不能为空" })
  desc: string;

  @IsNotEmpty({ message: "项目图标不能为空" })
  logo: string;

  user_id?: number;
}