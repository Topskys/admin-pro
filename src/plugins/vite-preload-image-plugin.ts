import { Plugin } from 'vite';
import fg from 'fast-glob';

type PluginOptions = {
  dir: string;
  files?: string[];
  attrs?: { [key: string]: any };
};

/**
 * 图片预加载插件
 * https://v.douyin.com/iATVWAKr/
 *
 * @param options 插件选项
 * @returns 返回一个插件对象
 */
export const preloadImagePlugin = (options: PluginOptions): Plugin => {
  const { dir, attrs = {}, files = [] } = options;
  return {
    name: 'vite-preload-image-plugin',
    /**
     * 转换 index.html 文件中的图片link链接
     *
     * @param html 待处理的 HTML 字符串
     * @param ctx 上下文对象，包含服务器配置等信息
     * @returns 包含预处理图片的数组，每个元素是一个包含标签和属性的对象
     */
    transformIndexHtml(html, ctx) {
      const base = ctx.server?.config.base;
      const images = fg.sync(dir, {
        cwd: ctx.server?.config.publicDir
      });

      return images.map((image) => ({
        tag: 'link',
        attrs: {
          rel: 'preload',
          as: 'image',
          href: base + image,
          ...attrs
        }
      }));
    }
  };
};
