import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtConfigService } from '@src/config/jwt/config.service';
import { AuthService } from './auth.service';
import { IPayload } from './auth.interface';
import { ApiException } from '@src/filter/api-exception.filter';
import { ApiErrorCode } from '@src/common/enum/api-error-code.enum';
import { UserStatus } from '@src/common/enum/user-status.enum';
import { IRequestUser } from '@src/common/interface/request-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    jwtConfigSerivce: JwtConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigSerivce.secret,
    });
  }

  /**
   * 如果 PassportStrategy 解析请求头中的 authorization: "Bear ${access_token}"
   * 解析失败：抛出解析异常，不会调用此函数
   * 解析成功：调用此函数，函数内部实现自定义业务校验，返回用户或 null 或抛出自定义异常
   * 返回用户：会将当前返回值写入上下文中，可以通过 @Request() req.user 获取
   * @param payload JWT 负载
   */
  public async validate(payload: IPayload): Promise<IRequestUser> {
    const { id, job_number } = payload;

    const user = await this.authService.validatePayload({ id, job_number });

    if (!user) throw new ApiException('用户不存在', ApiErrorCode.JWT_PAYLOAD_INVALID);

    const { status } = user;

    if (status === UserStatus.ACTIVED) {
      return user;
    }

    let message = '';

    status === UserStatus.FORZEN && (message = '账户被冻结');
    status === UserStatus.INACTIVATED && (message = '账户未激活');

    throw new ApiException(message, ApiErrorCode.PERMISSION_DENIED);
  }
}
