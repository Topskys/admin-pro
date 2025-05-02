import { computed } from 'vue';

/**
 * 创建一个 useComputed 函数，该函数通过传入的函数 fn 和参数生成计算属性，让计算属性可以传参且不会被多次运行（缓存），高阶函数。
 *
 * @param fn 计算属性的计算函数
 * @returns 一个函数，该函数接受参数并返回计算属性
 * @example
 * const useComputed = createUseComputed((a, b) => a + b);
 * const computedValue = useComputed(1, 2); // 使用计算属性并传入参数
 * console.log(computedValue.value); // 输出：3
 * @example
 * const c = computed(()=>(a,b)=>a+b); // 错误示范，计算属性不能直接传入参数，这样会失去缓存效果，直接类似const add=(a,b)=>a+b。
 * const computedValue = c(1, 2); // 这样每次都会重新计算，失去缓存效果。
 * @example
 * const useComputed = createUseComputed((a, b) => a + b); // 正确示范，使用createUseComputed创建计算属性工厂函数。
 * const computedValue = useComputed(1, 2); // 使用计算属性并传入参数
 * console.log(computedValue.value); // 输出：3
 */
export function createUseComputed(fn: (...args: any[]) => any) {
  const map = new Map();
  return function useComputed(...args) {
    const key = JSON.stringify(args);
    if (!map.has(key)) {
      const result = computed(() => fn(...args));
      map.set(key, result);
    }
    return map.get(key);
  };
}
