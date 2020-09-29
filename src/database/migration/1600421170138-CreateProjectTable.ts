import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProjectTable1600421170138 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('project', true);

    await queryRunner.createTable(
      new Table({
        name: 'project',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            comment: '项目名称',
          },
          {
            name: 'desc',
            type: 'text',
            comment: '项目描述',
          },
          {
            name: 'logo',
            type: 'varchar',
            comment: '项目图标',
          },
          {
            name: 'user_id',
            type: 'int',
            comment: '创建者',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            comment: '创建时间',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            comment: '更新时间',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('project');
  }
}
