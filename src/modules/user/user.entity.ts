import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  AllowNull,
  Length,
  Unique,
  Default,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';

import { Roles } from '@src/common/enums/roles.enum';
import { UserSex } from '@src/common/enums/user-sex.enum';
import { UserStatus } from '@src/common/enums/user-status.enum';

@Table({ tableName: 'user' })
export class UserEntity extends Model<UserEntity> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @AllowNull
  @Column
  avatar: string;

  @Length({ max: 20 })
  @AllowNull
  @Column
  nickname: string;

  @Length({ max: 20 })
  @Column
  fullname: string;

  @Unique
  @Column(DataType.INTEGER)
  job_number: number;

  @Default(Roles.STAFF)
  @Column
  role: Roles;

  @Column
  hashed_password: string;

  @Default(UserSex.NONE)
  @Column(DataType.ENUM(UserSex.MALE, UserSex.FEMAL, UserSex.NONE))
  sex: UserSex;

  @Default(UserStatus.INACTIVATED)
  @Column(
    DataType.ENUM(
      UserStatus.NORMAL,
      UserStatus.FORZEN,
      UserStatus.INACTIVATED,
      UserStatus.LOSED,
    ),
  )
  status: UserStatus;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;

  @AllowNull
  @Column(DataType.DATE)
  login_at: Date;
}
