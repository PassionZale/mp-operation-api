import { ValueTransformer } from 'typeorm';
import * as moment from 'moment-timezone';
import { TIME_FORMAT } from '@src/common/constant/format.constant';

/**
 * typeorm 日期存储转换
 */
export class DateValueTransformer implements ValueTransformer {
  from(value?: string): string {
    if (value && moment(value).isValid()) {
      return moment(value).format(TIME_FORMAT);
    }

    return null;
  }

  to(value?: string): string {
    return value;
  }
}

/**
 * typeorm 媒体资源全路径转换
 */
export class MediaPathTransformer implements ValueTransformer {
  from(value?: string): string {
    if (value) {
      return process.env.APP_URL ? `${process.env.APP_URL}/${value}` : value;
    }

    return value;
  }

  to(value?: string): string {
    return value;
  }
}
