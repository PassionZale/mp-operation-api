import {
  ValidationPipe,
  ArgumentMetadata,
  Injectable,
} from '@nestjs/common';
import { REWRITE_VALIDATOR_OPTIONS } from '@src/common/constant/meta.constant';

/**
 * 扩展 ValidationPipe，让其支持全局属性重写
 */
@Injectable()
export class ApiValidationPipe extends ValidationPipe {
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<any> {
    const options = Reflect.getMetadata(
      REWRITE_VALIDATOR_OPTIONS,
      metadata.metatype,
    );

    // 存储 ValidationPipe 原始的 validatorOptions
    let originOptions;

    if (options) {
      originOptions = Object.assign({}, this.validatorOptions);
      // this.validatorOptions 混入由装饰器注入的 options
      this.validatorOptions = Object.assign(this.validatorOptions, options);
    }

    try {
      // 校验参数
      const result = await super.transform(value, metadata);
      if (originOptions) {
        // 校验完毕后重置 this.validatorOptions
        this.validatorOptions = originOptions;
      }

      return result;
    } catch (error) {
      // 校验失败抛出异常，异常会被 exceptionFactory 处理，并抛出 ApiException
      throw error;
    }
  }
}
