import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Transform } from 'class-transformer';

import { DateValueTransformer } from '@src/database/database.transformer';
import {
  PipeLineTypes,
  PipeLineCIRobots,
} from '@src/common/enum/pipeline.enum';
import { desensitization } from '@src/common/helper/sensitive.helper';
import { UserEntity } from '@src/module/user/user.entity';
import { ProjectEntity } from '@src/module/project/project.entity';

/**
 * 流水线
 */
@Entity('pipeline')
export class PipeLineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 名称
  @Column('varchar', { length: 100 })
  name: string;

  // APPID
  @Column('varchar', { length: 100 })
  appid: string;

  // 项目类型
  @Column('enum', {
    enum: [
      PipeLineTypes.MINI_GAME,
      PipeLineTypes.MINI_GAME_PLUGIN,
      PipeLineTypes.MINI_PROGRAM,
      PipeLineTypes.MINI_PROGRAM_PLUGIN,
    ],
    default: PipeLineTypes.MINI_PROGRAM,
  })
  type: PipeLineTypes;

  // 上传秘钥，可为空，为空则只能部署不能发布
  @Column('varchar', { nullable: true })
  @Transform(val => desensitization(val))
  private_key: string;

  // ci 机器人
  @Column('enum', {
    enum: [...Array(31).keys()].slice(1, 31),
    default: 1,
  })
  ci_robot: PipeLineCIRobots;

  // 项目
  @Column('int')
  project_id: number;
  project?: ProjectEntity;

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
