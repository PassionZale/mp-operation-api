import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  DateValueTransformer,
  MediaPathTransformer,
} from '@src/database/database.transformer';
import { UserRole } from '@src/common/enum/user-role.enum';
import { UserSex } from '@src/common/enum/user-sex.enum';
import { UserStatus } from '@src/common/enum/user-status.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 头像
  @Column('varchar', {
    nullable: true,
    transformer: new MediaPathTransformer(),
  })
  avatar: string;

  // 昵称：花名
  @Column('varchar', { length: 20, nullable: true })
  nickname: string;

  // 姓名：真实姓名
  @Column('varchar', { length: 20 })
  fullname: string;

  // 工号：用户名
  @Column('int', { unique: true })
  job_number: number;

  // 角色
  @Column('int', { default: UserRole.STAFF })
  role: UserRole;

  // 密码
  @Column({ select: false })
  hashed_password?: string;

  // 性别
  @Column('enum', {
    enum: [UserSex.MALE, UserSex.FEMAL, UserSex.NONE],
    default: UserSex.NONE,
  })
  sex: UserSex;

  // 状态
  @Column('enum', {
    enum: [
      UserStatus.ACTIVED,
      UserStatus.FORZEN,
      UserStatus.INACTIVATED,
      UserStatus.LOSED,
    ],
    default: UserStatus.ACTIVED,
  })
  status: UserStatus;

  // 创建时间
  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new DateValueTransformer(),
  })
  created_at: Date;

  // 更新时间
  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new DateValueTransformer(),
  })
  updated_at: Date;

  // 登录时间
  @Column('datetime', {
    nullable: true,
    transformer: new DateValueTransformer(),
  })
  login_at: Date;
}
