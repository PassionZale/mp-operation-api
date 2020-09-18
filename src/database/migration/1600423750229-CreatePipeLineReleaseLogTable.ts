import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePipeLineReleaseLogTable1600423750229
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pipeline_release_log', true);

    await queryRunner.createTable(
      new Table({
        name: 'pipeline_release_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          // TODO 设计其他字段
          {
            name: 'deploy_id',
            type: 'varchar',
            length: '36',
            comment: '流水线部署 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            comment: '提交者',
          },
          {
            name: 'released_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            comment: '发布时间',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pipeline_release_log');
  }
}
