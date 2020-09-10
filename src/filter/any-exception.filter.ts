import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from './api-response.filter';
import { DEFAULT_ERROR_MESSAGE } from '@src/common/constant/text.constant';

/**
 * 未做任何捕获的异常，最终会被改过滤器处理，并抛出一个 ApiResponse
 */
@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(exception);

    const apiRes = new ApiResponse(null, DEFAULT_ERROR_MESSAGE, status);

    response.status(status).json({
      ...apiRes.getResponse(),
      path: request.originalUrl,
    });
  }
}
