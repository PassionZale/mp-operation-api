import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from './api-response.filter';
import { ApiException } from './api-exception.filter';

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
      const apiRes = new ApiResponse(null, message, status);
      response.status(status).json({
        ...apiRes.getResponse(),
        path: request.originalUrl,
      });
    }
  }
}
