import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IBaseResponse } from '@src/common/interface/base-response.interface';
import { ApiResponse } from '@src/filter/api-response.filter';

/**
 * 实用 ApiResponse 格式化响应数据结构
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IBaseResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IBaseResponse<T>> {
    return next.handle().pipe(
      map(data => {
        if (data instanceof ApiResponse) {
          return data.getResponse();
        }

        const response = new ApiResponse(data);

        return response.getResponse();
      }),
    );
  }
}
