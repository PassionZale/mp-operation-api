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
import { PipeLineDeployLog } from './pipeline-deploy-log.entity';
import { PipeLineReleaseLog } from './pipeline-release-log.entity';

type PipeLineType =
  | 'miniProgram'
  | 'miniProgramPlugin'
  | 'miniGame'
  | 'miniGamePlugin';

type PipeLineCIRobot =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30;

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
    () => PipeLineDeployLog,
    pipeline_deploy_log => pipeline_deploy_log.pipeline,
  )
  pipeline_deploy_logs: PipeLineDeployLog[];

  @OneToMany(
    () => PipeLineReleaseLog,
    pipeline_release_logs => pipeline_release_logs.pipeline,
  )
  pipeline_release_logs: PipeLineReleaseLog[];

  // 名称
  @Column('varchar', { length: 100 })
  name: string;

  // APPID
  @Column('varchar', { length: 100 })
  appid: string;

  // 项目类型
  @Column('enum', {
    enum: ['miniProgram', 'miniProgramPlugin', 'miniGame', 'miniGamePlugin'],
    default: 'miniProgram',
  })
  type: PipeLineType;

  // 上传秘钥，可为空，为空则只能部署不能发布
  @Column('varchar', { nullable: true })
  private_key: string;

  // ci 机器人
  @Column('enum', {
    enum: [...Array(31).keys()].slice(1, 31),
    default: 1,
  })
  ci_robot: PipeLineCIRobot;

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
