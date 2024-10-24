import { get } from '@/http/request';

export const getProjectList = (data?: any) => {
  return get({}, '/projects', data);
};
