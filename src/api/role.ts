import { get } from '@/http/request';
export const getRoleList = async (data?: any) => {
  return get({}, '/getRoleList', data);
};
