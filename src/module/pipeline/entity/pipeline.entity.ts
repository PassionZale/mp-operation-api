import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DateValueTransformer } from '@src/database/database.transformer';

import { UserEntity } from '@src/module/user/user.entity';
import { PipeLineDeployLogEntity } from './pipeline-deploy-log.entity';
import { PipeLineReleaseLogEntity } from './pipeline-release-log.entity';
import { PipeLineTypes, PipeLineCIRobots } from '@src/common/enum/pipeline.enum';

/**
 * 流水线
 */
@Entity('pipeline')
export class PipeLineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => UserEntity,
    user => user.pipelines,
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(
    () => PipeLineDeployLogEntity,
    pipeline_deploy_log => pipeline_deploy_log.pipeline,
  )
  pipeline_deploy_logs: PipeLineDeployLogEntity[];

  @OneToMany(
    () => PipeLineReleaseLogEntity,
    pipeline_release_logs => pipeline_release_logs.pipeline,
  )
  pipeline_release_logs: PipeLineReleaseLogEntity[];

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
  private_key: string;

  // ci 机器人
  @Column('enum', {
    enum: [...Array(31).keys()].slice(1, 31),
    default: 1,
  })
  ci_robot: PipeLineCIRobots;

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
