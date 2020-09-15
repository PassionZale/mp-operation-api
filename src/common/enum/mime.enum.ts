/**
 * MIME 类型列表，用于 download 时设置响应头
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
export enum Mime {
  jpeg = 'image/jpeg',
  jpg = 'image/jpeg',
  png = 'image/png',
  zip = 'application/zip',
  rar = 'application/x-rar-compressed'
}