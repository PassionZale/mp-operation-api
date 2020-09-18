import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { UserRole } from '@src/common/enum/user-role.enum';
import { UserSex } from '@src/common/enum/user-sex.enum';
import { UserStatus } from '@src/common/enum/user-status.enum';

export class CreateUserTable1600413516296 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user', true);

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: true,
            comment: '用户头像',
          },
          {
            name: 'nickname',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '用户昵称',
          },
          {
            name: 'fullname',
            type: 'varchar',
            length: '20',
            comment: '用户姓名',
          },
          {
            name: 'job_number',
            type: 'int',
            isUnique: true,
            comment: '用户工号(用户名)',
          },
          {
            name: 'role',
            type: 'int',
            default: UserRole.STAFF,
            comment: '用户角色',
          },
          {
            name: 'hashed_password',
            type: 'varchar',
            comment: '用户密码',
          },
          {
            name: 'sex',
            type: 'enum',
            enum: [UserSex.MALE, UserSex.FEMAL, UserSex.NONE],
            default: `'${UserSex.NONE}'`,
            comment: '用户性别',
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              UserStatus.ACTIVED,
              UserStatus.FORZEN,
              UserStatus.INACTIVATED,
              UserStatus.LOSED,
            ],
            default: `'${UserStatus.ACTIVED}'`,
            comment: '用户状态',
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
          {
            name: 'login_at',
            type: 'datetime',
            isNullable: true,
            comment: '登录时间',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
