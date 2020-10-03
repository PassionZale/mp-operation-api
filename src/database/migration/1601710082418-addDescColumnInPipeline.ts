import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addDescColumnInPipeline1601710082418
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'pipeline',
      new TableColumn({
        name: 'desc',
        type: 'text',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pipeline', 'desc');
  }
}
