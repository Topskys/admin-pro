import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface Attrs {
  rel: string;
  as: string;
  href: string;
}

interface PreloadPluginOptions {
  /* 文件目录或链接数组 */
  dirs?: string[] | string;
  /* link标签属性配置，须dirs为数组时才起作用 */
  attrs?: Partial<Attrs>;
}

export function vitePreloadPlugin(options: PreloadPluginOptions): Plugin {
  const { dirs, attrs } = options;

  return {
    name: 'vite-plugin-preload',
    transformIndexHtml(html, ctx) {
      // 需要预加载的资源
      const preloads = new Set();

      // 从 src 目录动态查找所有 js 和 css 文件
      const addPreloadFiles = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const absolutePath = path.join(dir, file);
          const stat = fs.statSync(absolutePath);
          if (stat.isDirectory()) {
            addPreloadFiles(absolutePath); // 递归处理子目录
          } else if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.png') || file.endsWith('.jpg')) {
            const relativePath = path.relative(process.cwd(), absolutePath);
            preloads.add(`/${relativePath}`);
          }
        }
      };

      // 处理includes
      return dirs.map((item, index, array) => {
        return {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'image',
            ...attrs
          }
        };
      });
    }
  };
}

// 预加载插件
function preloadPlugin() {
  return {
    name: 'vite-plugin-preload',
    // 这里可以通过 Vite 的构建钩子来处理更多文件
    buildStart() {
      this.addWatchFile('src/**/*'); // 监控源文件变动
    },
    transformIndexHtml(html) {
      // 需要预加载的资源
      const preloads = new Set();

      // 示例：从 src 目录动态查找所有 js 和 css 文件
      const addPreloadFiles = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const absolutePath = path.join(dir, file);
          const stat = fs.statSync(absolutePath);
          if (stat.isDirectory()) {
            addPreloadFiles(absolutePath); // 递归处理子目录
          } else if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.png') || file.endsWith('.jpg')) {
            const relativePath = path.relative(process.cwd(), absolutePath);
            preloads.add(`/${relativePath}`);
          }
        }
      };

      addPreloadFiles(path.join(process.cwd(), 'src'));

      // 构建 preload link 标签
      const preloadLinks = Array.from(preloads)
        .map((link) => {
          if (link.endsWith('.js')) {
            return `<link rel="preload" href="${link}" as="script">`;
          } else if (link.endsWith('.css')) {
            return `<link rel="preload" href="${link}" as="style">`;
          } else if (link.endsWith('.png') || link.endsWith('.jpg')) {
            return `<link rel="preload" href="${link}" as="image">`;
          }
          return '';
        })
        .filter(Boolean) // 过滤空值
        .join('\n');

      return html.replace(/<\/head>/, `${preloadLinks}\n</head>`);
    }
  };
}
