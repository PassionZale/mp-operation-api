import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestUser } from '@src/common/interface/request-user.interface'

export type UserKey = 'id' | 'job_number';

/**
 * 从 req.user 中取出 user
 * 或取出 user.id 或 user.job_number
 */
export const RequestUser = createParamDecorator(
  (data: UserKey | undefined, ctx: ExecutionContext): IRequestUser | number => {
    const request = ctx.switchToHttp().getRequest();
    const user: IRequestUser = request.user;

    if (data) {
      return user[data];
    }

    return user;
  },
);
