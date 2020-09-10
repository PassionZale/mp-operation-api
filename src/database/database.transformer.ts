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
