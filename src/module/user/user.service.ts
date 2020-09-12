import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as moment from 'moment-timezone';

import { UserEntity } from './user.entity';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { encrypt } from '@src/common/helper/bcrypt.helper';
import { ApiException } from '@src/filter/api-exception.filter';
import { IFindOneCondition, ISelectHashedPassword } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findAll(
    condition?: ISelectHashedPassword,
  ): Promise<UserEntity[]> {
    const db = this.userRepository.createQueryBuilder('user');

    if (condition && condition.select_hashed_password) {
      db.addSelect('user.hashed_password');
    }

    const users = await db.getMany();

    return users;
  }

  public async findOne(
    condition: IFindOneCondition,
  ): Promise<UserEntity | undefined> {
    const { id, job_number, select_hashed_password } = condition;

    const db = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id OR user.job_number = :job_number', {
        id,
        job_number,
      });

    if (select_hashed_password) {
      db.addSelect('user.hashed_password');
    }

    const user = await db.getOne();

    return user;
  }

  public async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  public async create(dto: CreateUserRequestDto): Promise<UserEntity> {
    const { job_number, password, ...others } = dto;

    const user = await this.findOne({ job_number });

    if (user) throw new ApiException(`用户: ${job_number} 已存在`);

    const hashed_password = encrypt(password);

    return this.userRepository.save({ job_number, hashed_password, ...others });
  }

  public async updateUserLoginAt(id: number): Promise<boolean> {
    const login_at = (moment().format() as unknown) as Date;

    const updateResult: UpdateResult = await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        login_at,
      })
      .where('id = :id', { id })
      .execute();

    return !!updateResult.affected;
  }
}
