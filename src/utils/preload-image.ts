type PreloadImagesOptions = {
  timeout?: number; // 超时时间
  max?: number; // 并发数<=6
};

/**
 * 异步预加载图片资源
 *
 * <link rel="preload" as="image" href="https://picsum.photos/id/101/200/300">
 * @param images 图片资源路径数组
 * @param options 预加载选项
 * @param options.max 最大并发数，默认为3
 * @param options.timeout 超时时间，默认为10秒
 */
export function preloadImages(images: string[], options: PreloadImagesOptions) {
  const _imgs = [...images];
  const { max = 3, timeout = 10 * 1000 } = options;

  function loadImage() {
    const src = _imgs.shift()!;
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      link.onload = resolve;
      link.onerror = reject;
      // 超时抛错误
      setTimeout(reject, timeout);
    });
  }

  function _loadImage() {
    loadImage().finally(() => {
      // 递归终止条件
      if (_imgs.length > 0) {
        _loadImage();
      }
    });
  }

  // 并发数<=6
  for (let i = 0; i < max; ++i) _loadImage();
}

export default preloadImages;
