/**
 * 深度克隆
 * @param {object} target
 * @returns any
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
