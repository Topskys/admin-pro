import { get } from '@/http/request';
export const getUserList = async (data?: any) => {
  return get({}, '/getUserList', data);
};
