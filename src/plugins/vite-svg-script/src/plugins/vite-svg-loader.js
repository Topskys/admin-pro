// vite-plugin-svg-sprite.js
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join, basename, extname, dirname, relative } from 'path';

const PLUGIN_NAME = 'vite-plugin-svg-sprite';

const defaultOptions = {
  iconsDir: 'src/assets/icons',
  prefix: 'icon',
  output: false,
  outputDir: 'public',
  outputFile: 'sprite.svg',
  enableLogs: true,
  removeInlineStyles: true,
  debounceTime: 300, // 新增防抖时间
  defaultViewBox: '0 0 24 24' // 新增默认 viewBox
};

export default function svgSpritePlugin(userOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };
  let viteConfig = null;
  let rebuildTimer = null;

  const log = (message) => {
    if (options.enableLogs) {
      console.log(`[${PLUGIN_NAME}] ${message}`);
    }
  };

  const debounceRebuild = (callback) => {
    if (rebuildTimer) clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(callback, options.debounceTime);
  };

  const getOutputPath = () => {
    return resolve(viteConfig.root || process.cwd(), options.outputDir, options.outputFile);
  };

  const getSymbolId = (file) => {
    const name = basename(file, extname(file));
    return `${options.prefix}-${name}`;
  };

  const parseDimension = (value) => {
    // 提取数值部分（支持负数、小数和科学计数法）
    const num = parseFloat(value.replace(/[^\d.-eE]/g, ''));
    return isNaN(num) ? null : num;
  };

  const parseSvgContent = (content) => {
    // 匹配 viewBox（宽松匹配）
    let viewBox = null;
    const viewBoxMatch = content.match(/viewBox\s*=\s*["']\s*([-\d.eE\s]+)\s*["']/i);
    if (viewBoxMatch) {
      // 清理多余空格并标准化
      viewBox = viewBoxMatch[1].trim().replace(/\s+/g, ' ').replace(/\s,/g, ',');
    } else {
      // 获取 width 和 height
      const widthMatch = content.match(/width\s*=\s*["']\s*([^"']+?)\s*["']/i);
      const heightMatch = content.match(/height\s*=\s*["']\s*([^"']+?)\s*["']/i);
      const width = widthMatch ? parseDimension(widthMatch[1]) : null;
      const height = heightMatch ? parseDimension(heightMatch[1]) : null;
      // 生成 viewBox
      if (width !== null && height !== null) {
        viewBox = `0 0 ${width} ${height}`;
      } else {
        viewBox = options.defaultViewBox;
      }
    }

    // 移除SVG标签和闭合标签（仅保留内容）
    // 移除XML声明（HTML文档中不需要）
    // 清理多余的空格
    // 压缩内容
    let cleanedContent = content
      .replace(/<svg[^>]*>/i, '')
      .replace(/<\/svg>/i, '')
      .replace(/<\?xml.*?\?>/, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (options.removeInlineStyles) {
      cleanedContent = cleanedContent
        .replace(/(fill|stroke|style)="[^"]*"/gi, '')
        .replace(/(fill|stroke)-opacity="[^"]*"/gi, '');
    }

    return { content: cleanedContent, viewBox };
  };

  const generateSprite = () => {
    const startTime = Date.now();
    log(`Starting SVG sprite generation...`);

    const iconsPath = resolve(viteConfig.root || process.cwd(), options.iconsDir);

    if (!existsSync(iconsPath)) {
      console.warn(`[${PLUGIN_NAME}] Icons directory not found: ${iconsPath}`);
      return '';
    }

    const files = readdirSync(iconsPath, { recursive: true }); // 支持子目录
    const symbols = [];

    files.forEach((file) => {
      const fullPath = join(iconsPath, file);
      if (extname(fullPath) !== '.svg' || !existsSync(fullPath)) return;

      // log(`Processing: ${relative(process.cwd(), fullPath)}`);

      try {
        const content = readFileSync(fullPath, 'utf-8');
        const { viewBox, content: cleanedContent } = parseSvgContent(content);

        symbols.push({
          id: getSymbolId(file),
          content: cleanedContent,
          viewBox
        });
      } catch (error) {
        console.error(`[${PLUGIN_NAME}] Failed to process: ${fullPath}`, error);
      }
    });

    const spriteContent = `${symbols.map(({ id, viewBox, content }) => `<symbol id="${id}" viewBox="${viewBox}">${content}</symbol>`).join('\n  ')}`;
    log(`Generated ${symbols.length} icons in ${Date.now() - startTime}ms`);
    return spriteContent;
  };

  return {
    name: PLUGIN_NAME,

    config(config) {
      viteConfig = config;
      return config;
    },

    configureServer(server) {
      const fullPath = resolve(viteConfig.root || process.cwd(), options.iconsDir);

      // 确保目录存在
      if (!existsSync(fullPath)) {
        log(`Icons directory not found: ${fullPath}`);
        return;
      }

      const handleChange = (event, changedPath) => {
        // 类型检查
        if (typeof changedPath !== 'string') {
          log(`Invalid path received: ${changedPath}`);
          return;
        }

        try {
          const relativePath = relative(fullPath, changedPath);

          // 路径有效性验证
          if (!relativePath.startsWith('..') && extname(changedPath) === '.svg') {
            log(`Detected SVG ${event}: ${relativePath}`);
            debounceRebuild(() => {
              this.buildStart?.();
              server.ws.send({ type: 'full-reload' });
            });
          }
        } catch (error) {
          console.error(`[${PLUGIN_NAME}] Path processing failed:`, error);
        }
      };

      server.watcher.on('add', handleChange).on('change', handleChange).on('unlink', handleChange);
    },

    buildStart() {
      // const outputPath = getOutputPath();
      const sprite = generateSprite();

      // try {
      //   mkdirSync(dirname(outputPath), { recursive: true });
      //   writeFileSync(outputPath, sprite);
      //   log(`Sprite saved to: ${relative(process.cwd(), outputPath)}`);
      // } catch (error) {
      //   console.error(`[${PLUGIN_NAME}] Failed to write sprite:`, error);
      // }
    },
    transformIndexHtml() {
      // 生成雪碧图内容
      const spriteContent = generateSprite();

      // 有效性检查
      if (!spriteContent || !spriteContent.includes('<symbol')) {
        console.warn(`[${PLUGIN_NAME}] Generated empty sprite content`);
        return [];
      }
      return [
        {
          tag: 'svg',
          injectTo: 'body-prepend',
          attrs: {
            id: '__svg-sprite__',
            'aria-hidden': 'true',
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            style: 'display: none;'
          },
          children: spriteContent
        }
      ];
    }
  };
}
