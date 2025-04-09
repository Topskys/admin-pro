/**
 * 深拷贝函数
 *
 * @param {any} target - 要进行深拷贝的对象或数组
 * @returns {Object|Array} - 返回深拷贝后的对象或数组
 *
 * @description
 * 该函数用于对对象或数组进行深拷贝，即复制出与原对象或数组完全独立的副本。
 * 如果目标不是对象或数组，则直接返回该目标。
 * 如果是对象，则遍历对象的所有属性，递归调用自身进行深拷贝。
 * 如果是数组，则创建一个新的空数组，并遍历原数组的元素，递归调用自身进行深拷贝。
 */
export function deepCopy(target) {
  if (typeof target !== 'object') return target;
  let result = Array.isArray(target) ? [] : {};
  for (let key in target) {
    if (typeof target[key] === 'object') {
      result[key] = deepCopy(target[key]);
    } else {
      result[key] = target[key];
    }
  }
  return result;
}

/**
 * 生成唯一ID
 *
 * @returns 返回生成的唯一ID字符串
 */
export function generateUniqueId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}
