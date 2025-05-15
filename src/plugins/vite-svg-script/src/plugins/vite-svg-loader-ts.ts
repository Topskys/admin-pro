import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join, basename, extname, dirname } from 'path';
import { PluginOption, UserConfig } from 'vite';

interface SvgSpritePluginOptions {
  iconsDir?: string;
  prefix?: string;
  outputDir?: string;
  outputFile?: string;
  enableLogs?: boolean;
  removeInlineStyles?: boolean;
}

interface SymbolData {
  id: string;
  content: string;
  viewBox: string;
}

const PLUGIN_NAME = 'vite-plugin-svg-sprite';

export default function svgSpritePlugin(userOptions: SvgSpritePluginOptions = {}): PluginOption {
  const defaultOptions: Required<SvgSpritePluginOptions> = {
    iconsDir: 'src/assets/icons',
    prefix: 'icon',
    outputDir: 'public',
    outputFile: 'sprite.svg',
    enableLogs: false,
    removeInlineStyles: false
  };

  const options: Required<SvgSpritePluginOptions> = {
    ...defaultOptions,
    ...userOptions
  };

  let viteConfig: UserConfig;

  const log = (message: string) => {
    if (options.enableLogs) {
      console.log(`[${PLUGIN_NAME}] ${message}`);
    }
  };

  const getOutputPath = () => {
    return resolve(viteConfig.root || process.cwd(), options.outputDir, options.outputFile);
  };

  const getSymbolId = (file: string): string => {
    const name = basename(file, extname(file));
    return `${options.prefix}-${name}`;
  };

  const parseSvgContent = (content: string): Omit<SymbolData, 'id'> => {
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

  const generateSprite = (): string => {
    const startTime = Date.now();
    log(`Starting SVG sprite generation (removeInlineStyles: ${options.removeInlineStyles})...`);

    const iconsPath = resolve(viteConfig.root || process.cwd(), options.iconsDir);

    if (!existsSync(iconsPath)) {
      console.warn(`[${PLUGIN_NAME}] Icons directory not found: ${iconsPath}`);
      return '';
    }

    const files = readdirSync(iconsPath);
    const symbols: SymbolData[] = [];

    files.forEach((file) => {
      if (extname(file) !== '.svg') {
        return;
      }

      const filePath = join(iconsPath, file);
      log(`Processing: ${filePath}`);

      try {
        const content = readFileSync(filePath, 'utf-8');
        const { viewBox, content: cleanedContent } = parseSvgContent(content);

        symbols.push({
          id: getSymbolId(file),
          content: cleanedContent,
          viewBox
        });
      } catch (error) {
        console.error(`[${PLUGIN_NAME}] Failed to process: ${filePath}`, error);
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
      server.watcher.add(fullPath);
      server.watcher.on('all', (event, path) => {
        if (path.includes(options.iconsDir) && event !== 'change') {
          log(`File change detected: ${path}`);
          this.buildStart?.();
          server.ws.send({ type: 'full-reload' });
        }
      });
    },

    buildStart() {
      const outputPath = getOutputPath();
      const sprite = generateSprite();

      try {
        mkdirSync(dirname(outputPath), { recursive: true });
        writeFileSync(outputPath, sprite);
        log(`Sprite saved to: ${outputPath}`);
      } catch (error) {
        console.error(`[${PLUGIN_NAME}] Failed to write sprite:`, error);
      }
    },

    transformIndexHtml() {
      const spritePath = getOutputPath();
      if (!existsSync(spritePath)) return;

      return [
        {
          tag: 'div',
          injectTo: 'body-prepend',
          attrs: {
            id: 'svg-sprite-dom',
            'aria-hidden': 'true',
            style: 'display: none;'
          },
          children: readFileSync(spritePath, 'utf-8')
        }
      ];
    }
  };
}
