import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from './api-response.filter';
import { ApiException } from './api-exception.filter';
import { MulterExceptions } from '@src/common/enum/multer-exceptions.enum';
import { ApiErrorCode } from '@src/common/enum/api-error-code.enum';

/**
 * 捕获 HttpException，例如：
 * throw new HttpException('权限不足', HttpStatus.FORBIDDEN)
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    if (exception instanceof ApiException) {
      response.status(status).json({
        ...exception.getResponse(),
        path: request.originalUrl,
      });
    } else {
      const apiRes = this.customExceptionTransform(message, status);

      response.status(status).json({
        ...apiRes.getResponse(),
        path: request.originalUrl,
      });
    }
  }

  customExceptionTransform(message: string, status: number): ApiResponse {
    const apiRes = new ApiResponse(null, message, status);
    
    /**
     * nestjs 框架自行处理了 multer exception => 太尼玛坑了 o(╥﹏╥)o
     * 导致无法通过 exception instanceof MulterError 来区分异常为 HttpException 还是 MulterError
     * 此处通过匹配 exception.message 与 multer.error.message 是否相等来区分异常是否为 MulterError
     * 若匹配上，则覆写 message 与 code
     */
    switch (message) {
      case MulterExceptions.LIMIT_FILE_SIZE:
        apiRes.message = '文件大小超出限制';
        apiRes.code = ApiErrorCode.FAIL;
        break;
      case MulterExceptions.LIMIT_FILE_COUNT:
        apiRes.message = '文件数量超出限制';
        apiRes.code = ApiErrorCode.FAIL;
        break;
      case MulterExceptions.LIMIT_UNEXPECTED_FILE:
        apiRes.message = '上传参数不能为空';
        apiRes.code = ApiErrorCode.FAIL;
        break;        
      // 下面这几种异常默认值都为无穷大或者无限制，业务上也没有配置 limits, 一般不会被触发
      // 因此统一用 “文件上传失败” 填充 message
      case MulterExceptions.LIMIT_FIELD_KEY:
      case MulterExceptions.LIMIT_FIELD_VALUE:
      case MulterExceptions.LIMIT_FIELD_COUNT:
      case MulterExceptions.LIMIT_UNEXPECTED_FILE:
      case MulterExceptions.LIMIT_PART_COUNT:
        apiRes.message = '文件上传失败';
        apiRes.code = ApiErrorCode.FAIL;
        break;
      // 这里没有 default, 不是漏了，是有意为之, 下面还需要原样返回 apiRes
    }

    /**
     * 剩余的 HttpException nestjs 框架内部如何处理就如何返回吧~
     */
    return apiRes;
  }
}
