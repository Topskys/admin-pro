import { deepCopy } from './utils';

/**
 * 缓存数据，用於批量上報數據等
 */
const cache = [];

/**
 * 獲取緩存數據
 * @returns 深拷貝的數據
 */
export function getCache() {
  return deepCopy(cache);
}

/**
 * 添加緩存數據
 * @param {any} data
 */
export function addCache(data) {
  cache.push(data);
}

/**
 * 清空緩存數據
 */
export function clearCache() {
  cache.length = 0;
}
