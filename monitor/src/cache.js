import { deepCopy } from './utils';

/**
 * 缓存数据，用於批量上報數據等
 */
const cache = [];

/**
 * 获取缓存数据
 *
 * @returns {Object} 缓存数据对象
 */
export function getCache() {
  return deepCopy(cache);
}

/**
 * 添加数据到缓存中
 *
 * @param {any} data - 要添加的数据
 */
export function addCache(data) {
  cache.push(data);
}

/**
 * 清空缓存
 *
 * 将缓存数组的长度设置为0，从而清空缓存中的所有数据。
 */
export function clearCache() {
  cache.length = 0;
}
