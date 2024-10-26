// 角色接口
export interface IRole {
  role: number; // 角色编号
  roleName: string;
}
// 用户接口
export interface IUser {
  id: number;
  nickName: string;
  userName: string;
  role: IRole[];
}
// 有权限角色接口
export interface IRoleWithAuth {
  roleId: number;
  roleName: string;
  auth: string[]; // 权限
}
// 用户查询接口
export interface IQueryParams {
  nickName: string;
  role: number;
}
// 用户编辑接口
export interface IEditUser {
  id: number;
  nickName: string;
  role: [];
  userName: string;
}
