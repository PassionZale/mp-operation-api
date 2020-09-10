import { HttpStatus } from '@nestjs/common'
import * as moment from 'moment-timezone';
import { DEFAULT_SUCCESS_MESSAGE } from '@src/common/constant/text.constant';
import { IBaseResponse } from '@src/common/interface/base-response.interface';

/**
 * 序列化 api 响应数据结构
 */
export class ApiResponse implements IBaseResponse{
  code: number;

  data: any;

  message: string;

  timestamp: number;

  constructor(data: unknown, message?: string, code?: number) {
    this.code = code || HttpStatus.OK;
    this.data = data || null;
    this.message = message || DEFAULT_SUCCESS_MESSAGE; 
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