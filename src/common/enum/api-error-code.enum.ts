/**
 * API 业务错误编码
 */
export const enum ApiErrorCode {
  /**
   * 默认错误码
   */
  FAIL = 4000,
  /**
   * access_token 解析异常：过期、不合法、未到使用时间等
   */
  ACCESS_TOKEN_INVALID = 40001,
  /**
   * jwt 中的荷载无法查询到对应用户
   */
  JWT_PAYLOAD_INVALID = 40002,
  /**
   * 权限不足
   */
  PERMISSION_DENIED = 40003,
  /**
   * 上传文件类型不合法
   */
  FILE_MIMETYPE_INVALID = 40004,
}
