import * as bcryptjs from 'bcryptjs';

/**
 * 同步生成盐
 */
export function genSalt(): string {
  return bcryptjs.genSaltSync(10);
}

/**
 * 同步加密
 * @param s 
 */
export function encrypt(s: string): string {
  if (!s) {
    return '';
  }
  const salt = genSalt();

  return bcryptjs.hashSync(s, salt);
}

/**
 * 同步校验
 * @param s 
 * @param hash 
 */
export function verify(s: string, hash: string): boolean {
  return bcryptjs.compareSync(s, hash)
}
