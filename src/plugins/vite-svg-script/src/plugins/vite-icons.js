import fs from 'fs';
import path from 'path';
import svgo from 'svgo';

const PLUGIN_NAME = 'vite-plugin-svg-sprite';

const defaultOptions = {
  iconsDir: 'src/assets/icons',
  prefix: 'icon',
  debounceTime: 300,
  defaultViewBox: '0 0 24 24'
};

export default function svgSpritePlugin(userOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };
  let viteConfig = null;
  let cachedSprite = null;

  const log = (message) => {
    if (options.enableLogs) {
      console.log(`[${PLUGIN_NAME}] ${message}`);
    }
  };

  const getSymbolId = (file) => {
    const name = path.basename(file, path.extname(file));
    return `${options.prefix}-${name}`;
  };

  const parseDimension = (value) => {
    const num = parseFloat(value.replace(/[^\d.-eE]/g, ''));
    return isNaN(num) ? null : num;
  };

  const parseSvgContent = async (content) => {
    try {
      const viewBoxMatch = content.match(/viewBox\s*=\s*["']\s*([-\d.eE\s]+)\s*["']/i);
      let viewBox = viewBoxMatch ? viewBoxMatch[1] : options.defaultViewBox;
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

      const { data } = await svgo.optimize(content);
      content = data || content;
      content = content
      .replace(/<svg[^>]*>/i, '')
      .replace(/<\/svg>/i, '')
      .replace(/<\?xml.*?\?>/, '')
      .replace(/\s+/g, ' ')
      .trim();
      // content = content.replace(/stroke="(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)"/g, 'stroke="currentColor"');
      content = content.replace(/stroke="[a-zA-Z#0-9]*"/, 'stroke="currentColor"');
      return { content, viewBox };
    } catch (error) {
      console.error(`[${PLUGIN_NAME}] SVG parsing failed:`, error);
      return {
        viewBox: options.defaultViewBox,
        content: '<path d="M0 0h24v24H0z" fill="red"/>'
      };
    }
  };

  const generateSprite = async () => {
    if (cachedSprite) return cachedSprite;
    log(`Starting SVG sprite generation...`);
    const iconsPath = path.resolve(viteConfig.root || process.cwd(), options.iconsDir);
    if (!fs.existsSync(iconsPath)) {
      console.warn(`[${PLUGIN_NAME}] Icons directory not found: ${iconsPath}`);
      return '';
    }

    const files = fs.readdirSync(iconsPath, { recursive: true });
    const symbols = [];

    for (const file of files) {
      const fullPath = path.join(iconsPath, file);
      if (path.extname(fullPath) !== '.svg' || !fs.existsSync(fullPath)) return;
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        const { viewBox, content: cleanedContent } = await parseSvgContent(content);
        symbols.push({ id: getSymbolId(file), content: cleanedContent, viewBox });
      } catch (error) {
        console.error(`[${PLUGIN_NAME}] Failed to process: ${path.relative(process.cwd(), fullPath)}`, error);
      }
    }

    cachedSprite =
      `${symbols.map(({ id, viewBox, content }) => `  <symbol id="${id}" viewBox="${viewBox}">${content}</symbol>`).join('\n')}`.trim();
    log(`Generated ${symbols.length} icons`);
    return cachedSprite;
  };

  return {
    name: PLUGIN_NAME,
    config(config) {
      viteConfig = config;
      return config;
    },
    configureServer(server) {
      const fullPath = path.resolve(viteConfig.root || process.cwd(), options.iconsDir);
      if (!fs.existsSync(fullPath)) {
        log(`Icons directory not found: ${fullPath}`);
        return;
      }
      const iconsPath = path.resolve(options.iconsDir);
      server.watcher.add(iconsPath);
      server.watcher.on('all', (event, path) => {
        if (path.includes(options.iconsDir) && event !== 'change') {
          this.buildStart();
          setTimeout(() => server.ws.send({ type: 'full-reload' }), 100);
        }
      });
    },
    async buildStart() {
      await generateSprite();
    },
    async transformIndexHtml() {
      const spriteContent = await generateSprite();
      if (!spriteContent?.includes('<symbol')) {
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
