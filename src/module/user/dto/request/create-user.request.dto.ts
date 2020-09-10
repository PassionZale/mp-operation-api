import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';
import { UserRole } from '@src/common/enum/user-role.enum';

export class CreateUserRequestDto {
  /**
   * 昵称
   */
  @MaxLength(20, {
    message: '昵称长度较大，最大长度为 $constraint1 字符',
  })
  @IsOptional()
  readonly nickname?: string;
  /**
   * 角色
   */
  @IsIn([UserRole.ADMIN, UserRole.DEVELOPER, UserRole.STAFF, UserRole.VISITOR], { message: '角色不存在' })
  @IsOptional()
  readonly role?: number;
  /**
   * 姓名
   */
  @MaxLength(20, {
    message: '姓名长度较大，最大长度为 $constraint1 字符',
  })
  @IsNotEmpty({ message: '姓名不能为空' })
  readonly fullname: string;
  /**
   * 用户名
   */
  @IsNumber({}, { message: '工号必须为数字' })
  @IsNotEmpty({ message: '工号不能为空' })
  readonly job_number: number;
  /**
   * 密码
   */
  @MaxLength(20, {
    message: '密码长度较大，最大长度为 $constraint1 字符',
  })
  @MinLength(6, {
    message: '密码长度较小，最小长度为 $constraint1 字符',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}
