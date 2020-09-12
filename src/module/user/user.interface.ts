import { UserSex } from "@src/common/enum/user-sex.enum";
import { UserStatus } from "@src/common/enum/user-status.enum";
import { UserRole } from "@src/common/enum/user-role.enum";

export interface IUserData {
  id: number;

  avatar?: string;

  nickname?: string;

  fullname: string;

  job_number: number;

  role: UserRole;

  hashed_password?: string;

  sex: UserSex;

  status: UserStatus;

  created_at?: Date;

  updated_at?: Date;

  login_at?: Date;
}

/**
 * 是否查询 hased_password 列
 */
export interface ISelectHashedPassword {
  select_hashed_password?: boolean;
}

/**
 * 根据 id 或 job_number 查询用户
 */
export interface IFindOneCondition extends ISelectHashedPassword {
  id?: number;

  job_number?: number;
}