import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DateValueTransformer } from '@src/database/database.transformer';
import { PipeLineEntity } from './pipeline.entity';
import { PipeLineReleaseLogEntity } from './pipeline-release-log.entity';

/**
 * 流水线部署记录
 * 例如：部署促销分支的测试环境、开发环境等
 */
@Entity('pipeline_deploy_log')
export class PipeLineDeployLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => PipeLineReleaseLogEntity,
    pipeline_release_log => pipeline_release_log.pipeline_deploy,
  )
  pipeline_release_logs: PipeLineReleaseLogEntity[];

  @ManyToOne(
    () => PipeLineEntity,
    pipeline => pipeline.pipeline_deploy_logs,
  )
  @JoinColumn({ name: 'pipeline_id' })
  pipeline: PipeLineEntity;

  // 描述
  @Column('text')
  desc: string;

  // 项目路径
  @Column()
  project_path: string;

  // 发布时间
  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new DateValueTransformer(),
  })
  deployed_at: Date;
}
