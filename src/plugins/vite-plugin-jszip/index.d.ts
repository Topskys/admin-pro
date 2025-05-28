import type { Plugin } from 'vite';
import type { IgnoreLike } from 'glob';

export type VitePluginJszipOptions = {
  /**
   * @description 输入目录，默认为 'dist'
   */
  inputDir?: string;
  /**
   * @description 输出目录，默认为 'dist-zip'
   */
  outputDir?: string;
  /**
   * @description 输出文件名，默认为 'output.zip'
   */
  outputName?: string;
  /**
   * @description 需要排除的文件或目录，默认为空
   */
  exclude?: string | string[] | IgnoreLike | undefined;
};

declare function vitePluginJszip(options?: VitePluginJszipOptions): Plugin;

export default vitePluginJszip;
