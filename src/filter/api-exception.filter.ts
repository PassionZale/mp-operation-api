import { HttpException, HttpStatus } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { ApiErrorCode } from '@src/common/enum/api-error-code.enum';
import { DEFAULT_ERROR_MESSAGE } from '@src/common/constant/text.constant';
import { IBaseResponse } from '@src/common/interface/base-response.interface';

/**
 * 在业务中抛出异常，例如：
 * throw new ApiException('姓名不能为空')
 * throw new ApiException('权限不足', ApiErrorCode.PERMISSION_DENIED)
 */
export class ApiException extends HttpException implements IBaseResponse {
  code: number;

  data: any;

  message: string;

  timestamp: number;

  constructor(
    errorMessage?: string,
    errorCode?: ApiErrorCode,
    errorData?: unknown,
  ) {
    super(errorMessage, HttpStatus.OK);

    this.message = errorMessage || DEFAULT_ERROR_MESSAGE;
    this.data = errorData || null;
    this.code = errorCode || ApiErrorCode.FAIL;
  }

  getResponse(): IBaseResponse {
    return {
      code: this.code,
      data: this.data,
      message: this.message,
      timestamp: moment().unix()
    }
  }
}
