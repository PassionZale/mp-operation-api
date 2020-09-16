import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { DateValueTransformer } from '@src/database/database.transformer';
import { UserEntity } from '@src/module/user/user.entity';

@Entity('project')
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 项目名
  @Column('varchar')
  name: string;

  // 项目描述
  @Column('text')
  desc: string;

  // 项目图标
  @Column('varchar')
  logo: string;

  // 创建者
  @Column('int')
  user_id: number;
  user?: UserEntity;

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
}
