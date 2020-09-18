import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePipeLineDeployLogTable1600423735018
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pipeline_deploy_log', true);

    await queryRunner.createTable(
      new Table({
        name: 'pipeline_deploy_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'desc',
            type: 'text',
            comment: '部署说明',
          },
          {
            name: 'project_path',
            type: 'varchar',
            comment: '部署路径',
          },
          {
            name: 'pipeline_id',
            type: 'varchar',
            length: '36',
            comment: '流水线 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            comment: '部署者',
          },
          {
            name: 'deployed_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            comment: '部署时间',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pipeline_deploy_log');
  }
}
