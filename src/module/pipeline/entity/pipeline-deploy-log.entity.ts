import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DateValueTransformer } from '@src/database/database.transformer';

/**
 * 流水线部署记录
 * 例如：部署促销分支的测试环境、开发环境等
 */
@Entity('pipeline_deploy_log')
export class PipeLineDeployLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 描述
  @Column('text')
  desc: string;

  // 项目路径
  @Column()
  project_path: string;

  // 流水线 ID
  @Column()
  pipeline_id: string;

  // 部署者
  @Column('int')
  deployed_by: number;

  // 发布时间
  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new DateValueTransformer(),
  })
  deployed_at: Date;
}
