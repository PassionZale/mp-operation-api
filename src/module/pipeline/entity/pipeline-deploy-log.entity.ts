import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DateValueTransformer } from '@src/database/database.transformer';

/**
 * 流水线部署记录
 * 例如：部署促销分支的测试环境、开发环境等
 */
@Entity('pipeline_deploy_log')
export class PipeLineDeployLog {
  @PrimaryGeneratedColumn()
  id: number;

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
