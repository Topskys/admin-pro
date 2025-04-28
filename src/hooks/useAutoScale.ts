/**
 * 防抖函数，用于控制事件调用频率，一段时间内只执行一次
 *
 * @param fn 回调函数
 * @param delay 延迟
 * @returns {(function(): void)|*}
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay = 200): (...args: Parameters<T>) => void {
  let lastCallTime = 0;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCallTime < delay) {
      // 如果当前时间与上次调用时间间隔小于延迟，则取消之前的调用
      return;
    }

    // 更新上次调用时间
    lastCallTime = now;

    // 执行回调函数
    fn.apply(this, args);
  };
}

export type Options = {
  /**
   * 设计宽度，默认为 1920
   */
  designWidth?: number;
  /**
   * 设计高度，默认为 1080
   */
  designHeight?: number;
  /**
   * 防抖时间，默认为 300ms
   */
  delay?: number;
};

/**
 * 大屏自动缩放自适应，自动缩放并居中元素的函数
 *
 * 该函数通过指定的 CSS 选择器定位需要自动缩放的元素，并根据设计宽度和高度计算缩放比例和居中位置。
 * 当窗口大小发生变化时，它会使用防抖机制来减少回调函数的调用频率，从而提高性能。
 *
 * @param selector {string} - CSS 选择器，用于定位需要自动缩放的元素。该参数是必需的，如果未提供将输出警告信息。
 * @param options {Options} - 可选参数，包含设计宽度、设计高度和防抖时间。
 *   - designWidth {number} - 设计宽度，单位为像素。默认为 1920。
 *   - designHeight {number} - 设计高度，单位为像素。默认为 1080。
 *   - delay {number} - 防抖时间，单位为毫秒。默认为 300 毫秒。
 * @returns {() => void} - 一个函数，用于卸载事件监听器，当不再需要自动缩放功能时调用。
 *
 * @example
 * useAutoScale('#myElement', { designWidth: 2560, designHeight: 1440, delay: 500 });
 */
export function useAutoScale(selector: string, options?: Options) {
  if (!selector) {
    console.warn('useAutoScale: selector is required');
    return;
  }

  const { designWidth = 1920, designHeight = 1080, delay = 300 } = options ?? {};
  const el = document.querySelector<HTMLElement>(selector)!;

  if (!el) {
    console.warn(`useAutoScale: element with selector "${selector}" not found`);
    return;
  }
  
  el.style.transformOrigin = 'top left';
  el.style.transition = 'transform 0.5s';
  
  function handler() {
    console.log("🚀 ~ useAutoScale ~ el:", el)
    const { innerWidth, innerHeight } = window;
    // 计算缩放比例
    const scaleX = innerWidth / designWidth;
    const scaleY = innerHeight / designHeight;
    const scale = Math.min(scaleX, scaleY);

    // 计算居中位移
    const left = (innerWidth - designWidth * scale) / 2;
    const top = (innerHeight - designHeight * scale) / 2;

    // 应用 CSS 转换
    el.style.transform = `translate3d(${left}px, ${top}px) scale(${scale})`;
  }

  const debounceHandler = debounce(handler, delay);

  // 初始化时调用
  handler();
  // 监听调整大小
  window.addEventListener('resize', debounceHandler);

  return () => {
    // 卸载
    window.removeEventListener('resize', debounceHandler);
  };
}
