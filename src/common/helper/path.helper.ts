import * as path from 'path';

/**
 * 移除 windows 路径的 //
 * @param s 
 */
export function removeForwardSlash(s: string): string {
  return path.normalize(s).replace(/\\/g, '/');
}
