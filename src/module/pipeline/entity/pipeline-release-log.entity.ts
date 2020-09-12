import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DateValueTransformer } from '@src/database/database.transformer';
import { PipeLineEntity } from './pipeline.entity';
import { PipeLineDeployLogEntity } from './pipeline-deploy-log.entity';

/**
 * 流水线发布日志
 * 例如：提交至第三方模板列表、提交小程序
 */
@Entity('pipeline_release_log')
export class PipeLineReleaseLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PipeLineEntity,
    pipeline => pipeline.pipeline_release_logs,
  )
  @JoinColumn({ name: 'pipeline_id' })
  pipeline: PipeLineEntity;

  @ManyToOne(
    () => PipeLineDeployLogEntity,
    pipeline_deploy => pipeline_deploy.pipeline_release_logs,
  )
  @JoinColumn({ name: 'pipeline_deploy_id' })
  pipeline_deploy: PipeLineDeployLogEntity;  

  // 发布时间
  @Column('datetime', {
    nullable: true,
    transformer: new DateValueTransformer(),
  })
  released_at: Date;
}
