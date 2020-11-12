import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DateValueTransformer } from '@src/database/database.transformer';
import { UserEntity } from '@src/module/user/user.entity';
import { PipeLineEntity } from './pipeline.entity';
import { ProjectEntity } from '@src/module/project/project.entity';

/**
 * 流水线部署记录
 * 例如：部署促销分支的测试环境、开发环境等
 */
@Entity('pipeline_deploy_log')
export class PipeLineDeployLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 版本号
  @Column()
  version: string;

  // 描述
  @Column('text')
  desc: string;

  // 项目路径
  @Column()
  project_path: string;

  project?: ProjectEntity;

  // 流水线 ID
  @Column()
  pipeline_id: number;
  pipeline?: PipeLineEntity;

  // 部署者
  @Column('int')
  user_id: number;
  user?: UserEntity;

  // 发布时间
  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new DateValueTransformer(),
  })
  deployed_at: Date;
}
