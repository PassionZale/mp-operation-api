import { REWRITE_VALIDATOR_OPTIONS } from '@src/common/constant/meta.constant';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { SetMetadata, CustomDecorator } from '@nestjs/common';

/**
 * 重写全局 validatePipe 中的 ValidatorOptions 配置项
 * @param options ValidatorOptions
 */
export function RewriteValidationOptions(
  options: ValidatorOptions,
): CustomDecorator {
  return SetMetadata(REWRITE_VALIDATOR_OPTIONS, options);
}
