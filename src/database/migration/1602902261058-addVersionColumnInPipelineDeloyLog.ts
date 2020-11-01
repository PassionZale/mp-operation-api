import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addVersionColumnInPipelineDeloyLog1602902261058
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'pipeline_deploy_log',
      new TableColumn({
        name: 'version',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pipeline_deploy_log', 'version');
  }
}
