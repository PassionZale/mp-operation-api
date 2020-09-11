/**
 * 角色集合
 */
export const enum UserRole {
  /**
   * 超级管理员
   */
  SUPERMAN,
  /**
   * 普通管理员
   */
  ADMIN,
  /**
   * 运营专员
   * 可以进行小程序发布等操作
   */
  DEVELOPER,
  /**
   * 普通员工（默认）
   * 只能操作自己的资源，如写作，编辑个人资料等
   */
  STAFF,
  /**
   * 访客
   * 通过第三方授权，如：gitlab 等初始化的用户
   * 暂时只定义枚举值，未实现开发任何功能
   */
  VISITOR,
}
