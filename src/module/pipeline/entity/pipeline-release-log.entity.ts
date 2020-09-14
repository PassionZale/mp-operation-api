import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DateValueTransformer } from '@src/database/database.transformer';

/**
 * 流水线发布日志
 * 例如：提交至第三方模板列表、提交小程序
 */
@Entity('pipeline_release_log')
export class PipeLineReleaseLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 流水线部署 ID
  @Column('int')
  pipeline_deploy_id: number;

  // 提交者
  @Column('int')
  released_by: number;

  // 发布时间
  @Column('datetime', {
    nullable: true,
    transformer: new DateValueTransformer(),
  })
  released_at: Date;
}
