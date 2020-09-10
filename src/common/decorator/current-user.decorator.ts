import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserData } from '@src/module/user/user.interface';

export type UserKey = 'id' | 'job_number';

/**
 * 从 req.user 中取出 user
 * 或取出 user.id 或 user.job_number
 */
export const CurrentUser = createParamDecorator(
  (data: UserKey | undefined, ctx: ExecutionContext): IUserData | number => {
    const request = ctx.switchToHttp().getRequest();
    const user: IUserData = request.user;

    if (data) {
      return user[data];
    }

    return user;
  },
);
