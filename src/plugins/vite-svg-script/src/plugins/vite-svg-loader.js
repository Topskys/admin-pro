// vite-plugin-svg-sprite.js
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join, basename, extname, dirname, relative } from 'path';

const PLUGIN_NAME = 'vite-plugin-svg-sprite';

const defaultOptions = {
  iconsDir: 'src/assets/icons',
  prefix: 'icon',
  outputDir: 'public',
  outputFile: 'sprite.svg',
  enableLogs: true,
  removeInlineStyles: true,
  debounceTime: 300 // 新增防抖时间
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

  const parseSvgContent = (content) => {
    const viewBoxMatch = content.match(/viewBox=["']([^"']+)["']/i);
    const viewBox = viewBoxMatch?.[1] || '0 0 24 24';

    let cleanedContent = content
      .replace(/<svg[^>]*>/i, '')
      .replace(/<\/svg>/i, '')
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

      log(`Processing: ${relative(process.cwd(), fullPath)}`);

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

    const spriteContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
  ${symbols
    .map(({ id, viewBox, content }) => `<symbol id="${id}" viewBox="${viewBox}">${content}</symbol>`)
    .join('\n  ')}
</svg>`;

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
      const outputPath = getOutputPath();
      const sprite = generateSprite();

      try {
        mkdirSync(dirname(outputPath), { recursive: true });
        writeFileSync(outputPath, sprite);
        log(`Sprite saved to: ${relative(process.cwd(), outputPath)}`);
      } catch (error) {
        console.error(`[${PLUGIN_NAME}] Failed to write sprite:`, error);
      }
    },

    transformIndexHtml() {
      const spritePath = getOutputPath();
      if (!existsSync(spritePath)) {
        return;
      }

      return [
        {
          tag: 'div',
          injectTo: 'body-prepend',
          attrs: {
            'aria-hidden': 'true',
            style: 'display: none;'
          },
          children: readFileSync(spritePath, 'utf-8')
        }
      ];
    }
  };
}
