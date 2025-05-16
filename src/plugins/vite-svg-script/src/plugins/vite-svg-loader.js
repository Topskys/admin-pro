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
  debounceTime: 300,
  defaultViewBox: '0 0 24 24'
};

export default function svgSpritePlugin(userOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };
  let viteConfig = null;
  let rebuildTimer = null;
  let cachedSprite = null;

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
    const num = parseFloat(value.replace(/[^\d.-eE]/g, ''));
    return isNaN(num) ? null : num;
  };

  const parseSvgContent = (content) => {
    try {
      let viewBox = options.defaultViewBox;
      const viewBoxMatch = content.match(/viewBox\s*=\s*["']\s*([-\d.eE\s]+)\s*["']/i);

      if (viewBoxMatch) {
        viewBox = viewBoxMatch[1].trim().replace(/\s+/g, ' ').replace(/\s,/g, ',');
      } else {
        const widthMatch = content.match(/width\s*=\s*["']\s*([^"']+?)\s*["']/i);
        const heightMatch = content.match(/height\s*=\s*["']\s*([^"']+?)\s*["']/i);
        const width = widthMatch ? parseDimension(widthMatch[1]) : null;
        const height = heightMatch ? parseDimension(heightMatch[1]) : null;

        if (width !== null && height !== null) {
          viewBox = `0 0 ${width} ${height}`;
        }
      }

      let cleanedContent = content
        .replace(/<svg[^>]*>/i, '')
        .replace(/<\/svg>/i, '')
        .replace(/<\?xml.*?\?>/, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (options.removeInlineStyles) {
        cleanedContent = cleanedContent.replace(/(fill|stroke|style|fill-opacity|stroke-opacity)="[^"]*"/gi, '');
      }

      return { content: cleanedContent, viewBox };
    } catch (error) {
      console.error(`[${PLUGIN_NAME}] SVG parsing failed:`, error);
      return {
        viewBox: options.defaultViewBox,
        content: '<path d="M0 0h24v24H0z" fill="red"/>'
      };
    }
  };

  const generateSprite = () => {
    if (cachedSprite) return cachedSprite;

    const startTime = Date.now();
    log(`Starting SVG sprite generation...`);

    const iconsPath = resolve(viteConfig.root || process.cwd(), options.iconsDir);

    if (!existsSync(iconsPath)) {
      console.warn(`[${PLUGIN_NAME}] Icons directory not found: ${iconsPath}`);
      return '';
    }

    const files = readdirSync(iconsPath, { recursive: true });
    const symbols = [];

    files.forEach((file) => {
      const fullPath = join(iconsPath, file);
      if (extname(fullPath) !== '.svg' || !existsSync(fullPath)) return;

      try {
        const content = readFileSync(fullPath, 'utf-8');
        const { viewBox, content: cleanedContent } = parseSvgContent(content);

        symbols.push({
          id: getSymbolId(file),
          content: cleanedContent,
          viewBox
        });
      } catch (error) {
        console.error(`[${PLUGIN_NAME}] Failed to process: ${relative(process.cwd(), fullPath)}`, error);
      }
    });

    cachedSprite = `${symbols.map(({ id, viewBox, content }) => `  <symbol id="${id}" viewBox="${viewBox}">${content}</symbol>`).join('\n')}`.trim();
    log(`Generated ${symbols.length} icons in ${Date.now() - startTime}ms`);
    return cachedSprite;
  };

  return {
    name: PLUGIN_NAME,

    config(config) {
      viteConfig = config;
      return config;
    },

    configureServer(server) {
      const fullPath = resolve(viteConfig.root || process.cwd(), options.iconsDir);

      if (!existsSync(fullPath)) {
        log(`Icons directory not found: ${fullPath}`);
        return;
      }

      const handleChange = (event, changedPath) => {
        if (typeof changedPath !== 'string') return;

        try {
          const relativePath = relative(fullPath, changedPath);
          if (!relativePath.startsWith('..') && extname(changedPath) === '.svg') {
            log(`Detected SVG change: ${event} ${relativePath}`);
            debounceRebuild(() => {
              cachedSprite = null;
              server.ws.send({ type: 'full-reload' });
            });
          }
        } catch (error) {
          console.error(`[${PLUGIN_NAME}] Path handling error:`, error);
        }
      };

      server.watcher.on('add', handleChange).on('change', handleChange).on('unlink', handleChange);
    },

    buildStart() {
      if (!options.output) return;

      const outputPath = getOutputPath();
      const sprite = generateSprite();

      try {
        mkdirSync(dirname(outputPath), { recursive: true });
        writeFileSync(outputPath, sprite);
        log(`Sprite saved to: ${relative(process.cwd(), outputPath)}`);
      } catch (error) {
        console.error(`[${PLUGIN_NAME}] Failed to write sprite file:`, error);
      }
    },

    transformIndexHtml() {
      const spriteContent = generateSprite();

      if (!spriteContent.includes('<symbol')) {
        console.warn(`[${PLUGIN_NAME}] Empty sprite content generated`);
        return [];
      }

      return [
        {
          tag: 'svg',
          injectTo: 'body',
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
