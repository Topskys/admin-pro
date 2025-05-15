import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import visualizer from 'rollup-plugin-visualizer';

// 需要排除的依赖项
const externals = ['path', 'fs', 'node:path', 'node:fs', 'vite', 'chokidar'];

export default {
  input: [
    // 'src/plugins/vite-svg-loader-no-deps.js',
    // 'src/plugins/vite-svg-loader-ts.ts',
    'src/plugins/vite-svg-loader.js'
  ], // 插件入口文件
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  external: (id) => {
    // 排除 Node 内置模块和外部依赖
    return externals.some((dep) => id === dep || id.startsWith(dep + '/'));
  },
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    terser(), // 压缩代码
    typescript({
      tsconfig: './tsconfig.json',
      tslib: require.resolve('tslib'),
      declaration: true,
      declarationDir: 'types'
    })
    // new visualizer()
  ]
};
