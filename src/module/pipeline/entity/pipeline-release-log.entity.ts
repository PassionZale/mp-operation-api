import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DateValueTransformer } from '@src/database/database.transformer';
import { PipeLineDeployLogEntity } from './pipeline-deploy-log.entity';
import { UserEntity } from '@src/module/user/user.entity';

/**
 * 流水线发布日志
 * 例如：提交至第三方模板列表、提交小程序
 */
@Entity('pipeline_release_log')
export class PipeLineReleaseLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 流水线部署 ID
  @Column('uuid')
  deploy_id: string;
  deploy_log?: PipeLineDeployLogEntity;

  // 提交者
  @Column('int')
  user_id: number;
  user?: UserEntity;

  // 发布时间
  @Column('datetime', {
    nullable: true,
    transformer: new DateValueTransformer(),
  })
  released_at: Date;
}
