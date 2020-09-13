import { UserSex } from "@src/common/enum/user-sex.enum";
import { UserStatus } from "@src/common/enum/user-status.enum";
import { UserRole } from "@src/common/enum/user-role.enum";

/**
 * request 对象中所包含的用户数据结构
 */
export interface IRequestUser {
  id: number;

  avatar?: string;

  nickname?: string;

  fullname: string;

  job_number: number;

  role: UserRole;

  sex: UserSex;

  status: UserStatus;

  created_at?: Date;

  updated_at?: Date;

  login_at?: Date;
}