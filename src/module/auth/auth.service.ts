import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@src/module/user/user.service';
import { verify } from '@src/common/helper/bcrypt.helper';
import { ITokenData } from './auth.interface';
import { IUserData, IFindOneCondition } from '../user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 校验 job_number 与 password 是否匹配
   * @param job_number
   * @param password
   */
  public async validateUserPassword(
    job_number: number,
    password: string,
  ): Promise<IUserData> {
    const user = await this.userService.findOne({
      job_number,
      select_hashed_password: true,
    });

    if (user && verify(password, user.hashed_password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashed_password, ...result } = user;

      return result;
    }

    return null;
  }

  /**
   * 将 id 和 job_number 注入 jwt payload，并颁发 access_token
   * @param user
   */
  public async createAccessToken(user: IUserData): Promise<ITokenData> {
    await this.userService.updateUserLoginAt(user.id);

    const sub = { id: user.id, job_number: user.job_number };

    return {
      access_token: this.jwtService.sign(sub),
    };
  }

  /**
   * 根据 payload 中的 id 和 job_number 查询用户是否存在
   * @param payload
   */
  public async validatePayload(payload: IFindOneCondition): Promise<IUserData> {
    const user = await this.userService.findOne(payload);

    return user;
  }
}
