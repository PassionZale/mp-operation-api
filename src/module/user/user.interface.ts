export interface IUserData {
  id: number;

  avatar?: string;

  nickname?: string;

  fullname: string;

  job_number: number;

  role: number;

  hashed_password?: string;

  sex: string;

  status: string;

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