import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { PipeLineTypes } from '@src/common/enum/pipeline.enum';

export class CreatePipeLineTable1600422377925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pipeline', true);

    await queryRunner.createTable(
      new Table({
        name: 'pipeline',
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
            length: '100',
            comment: '流水线名称',
          },
          {
            name: 'appid',
            type: 'varchar',
            length: '100',
            comment: '流水线 APPID',
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              PipeLineTypes.MINI_GAME,
              PipeLineTypes.MINI_GAME_PLUGIN,
              PipeLineTypes.MINI_PROGRAM,
              PipeLineTypes.MINI_PROGRAM_PLUGIN,
            ],
            default: `'${PipeLineTypes.MINI_PROGRAM}'`,
            comment: '项目类型',
          },
          {
            name: 'private_key',
            type: 'varchar',
            isNullable: true,
            comment: '上传秘钥',
          },
          {
            name: 'ci_robot',
            type: 'enum',
            enum: [...Array(31).keys()].slice(1, 31).map(item => `${item}`),
            default: '1',
            comment: 'ci 机器人',
          },
          {
            name: 'project_id',
            type: 'int',
            comment: '所属项目',
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
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pipeline');
  }
}
