import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VerifyErrors } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { ApiException } from '@src/filter/api-exception.filter';
import { IRequestUser } from '@src/common/interface/request-user.interface';
import { JwtErrorName } from '@src/common/enum/jwt-error-name.enum';
import { ApiErrorCode } from '@src/common/enum/api-error-code.enum';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err?: ApiException, user?: IRequestUser, info?: VerifyErrors): any {
    // user 由 jwt.strategy.ts 中的 validate() 所返回
    if (user && !err && !info) {
      return user;
    }

    // err 由 jwt.strategy.ts 中的 validate() 所抛出
    if (err) {
      throw err;
    }

    // info 由 PassportStrategy 解析 jwt 失败所抛出
    if (info) {
      const name = info.name;

      throw new ApiException(
        JwtErrorName[name],
        ApiErrorCode.ACCESS_TOKEN_INVALID,
      );
    }
  }
}
