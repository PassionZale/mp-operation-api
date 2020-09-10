import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IUserData } from '@src/module/user/user.interface';
import { ApiException } from '@src/filter/api-exception.filter';
import { ApiErrorCode } from '@src/common/enum/api-error-code.enum';
import { ROLE_GUARD_OPTIONS } from '@src/common/constant/meta.constant';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<number>(ROLE_GUARD_OPTIONS, context.getHandler());

    // 未标记所需角色，则直接通过
    if(role === undefined) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user: IUserData = request.user;

    // 当前用户权限值 大于 所需权限值，则无权访问
    if (user.role > role) {
      throw new ApiException('权限不足', ApiErrorCode.PERMISSION_DENIED);
    }

    return true;
  }
}
