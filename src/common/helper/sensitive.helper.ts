import { SENSITIVE_MASK } from '@src/common/constant/text.constant';

/**
 * 字符串脱敏工具函数
 * @param s 需要脱敏的字符串
 * @param beginIndex 从哪个索引开始
 * @param endIndex 以哪个索引结束
 */
export function desensitization(
  s: string,
  beginIndex = 1,
  endIndex = -1,
): string {
  if (!s) return '';
  
  const left = s.slice(0, beginIndex);
  const right = s.slice(endIndex);

  return `${left}${SENSITIVE_MASK}${right}`;
}
