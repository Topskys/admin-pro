// vite-plugin-svg-sprite.js
import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { basename, resolve, extname, join } from 'path';
import { optimize } from 'svgo';

export default function svgSpritePlugin(userOptions = {}) {
  const defaultOptions = {
    iconsDir: 'src/assets/icons',
    prefix: 'icon',
    outputDir: 'public',
    spriteFileName: 'sprite.svg',
    defaultViewBox: '0 0 24 24' // 新增默认 viewBox
  };

  const options = { ...defaultOptions, ...userOptions };

  const getSymbolId = (file) => {
    const name = basename(file, extname(file));
    return `${options.prefix}-${name}`;
  };

  const generateSprite = () => {
    const iconsPath = resolve(process.cwd(), options.iconsDir);
    if (!existsSync(iconsPath)) {
      console.warn(`[vite-plugin-svg-sprite] 图标目录不存在: ${iconsPath}`);
      return '';
    }

    const symbols = [];
    const files = readdirSync(iconsPath);

    files.forEach((file) => {
      if (extname(file) !== '.svg') return;

      const filePath = join(iconsPath, file);
      const svgContent = readFileSync(filePath, 'utf-8');

      try {
        // 优化配置保留 viewBox
        const { data: optimizedSvg } = optimize(svgContent, {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false // 禁止移除 viewBox
                }
              }
            },
            { name: 'removeXMLNS', active: true },
            { name: 'removeTitle', active: true },
            { name: 'removeDesc', active: true }
          ]
        });

        // 提取 viewBox
        const viewBoxMatch = optimizedSvg.match(/viewBox="([^"]*)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : options.defaultViewBox;

        // 提取有效内容
        const symbolContent = optimizedSvg
          .replace(/<svg[^>]*>/, '')
          .replace(/<\/svg>/, '')
          .trim();

        symbols.push(
          `<symbol id="${getSymbolId(file)}" viewBox="${viewBox}">
            ${symbolContent}
          </symbol>`
        );
      } catch (e) {
        console.error(`处理图标 ${file} 失败:`, e);
      }
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
      ${symbols.join('\n')}
    </svg>`;
  };

  return {
    name: 'vite-plugin-svg-sprite',

    configureServer(server) {
      const fullPath = resolve(process.cwd(), options.iconsDir);
      server.watcher.add(fullPath);
      server.watcher.on('all', (event, file) => {
        if (file.includes(options.iconsDir) && event !== 'change') {
          this.buildStart();
          server.ws.send({ type: 'full-reload' });
        }
      });
    },

    buildStart() {
      const sprite = generateSprite();
      const outputPath = resolve(process.cwd(), options.outputDir, options.spriteFileName);
      writeFileSync(outputPath, sprite);
    },

    transformIndexHtml(html) {
      const spritePath = resolve(process.cwd(), options.outputDir, options.spriteFileName);
      if (!existsSync(spritePath)) return;

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
