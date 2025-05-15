const path = require('path');
const json = require('@rollup/plugin-json');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');

const resolveFile = function (filePath) {
  return path.join(__dirname, filePath);
};

const plugins = [
  babel({
    extensions: ['.js'],
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
          }
        }
      ]
    ]
  }),
  json({
    compact: true
  })
];

module.exports = [
  {
    input: resolveFile('./src/plugins/vite-svg-loader.js'),
    output: {
      file: resolveFile('./dist/vite-svg-loader.js'),
      format: 'iife', // 適合<script>标签引入的脚本
      sourcemap: true,
      name: 'svgScript'
    },
    plugins
  },
  {
    input: resolveFile('./src/plugins/vite-svg-loader.js'),
    output: {
      file: resolveFile('./dist/vite-svg-loader.min.js'),
      format: 'iife', // 適合<script>标签引入的脚本
      sourcemap: true,
      name: 'svgScript',
      plugins: [terser()] // 压缩
    },
    plugins
  },
  {
    input: resolveFile('./src/plugins/vite-svg-loader.js'),
    output: {
      file: resolveFile('./dist/vite-svg-loader.esm.js'),
      format: 'esm',
      sourcemap: true,
      name: 'svgScript'
    },
    plugins
  },
  {
    input: resolveFile('./src/plugins/vite-svg-loader.js'),
    output: {
      file: resolveFile('./dist/vite-svg-loader.cjs.js'),
      format: 'cjs',
      sourcemap: true,
      name: 'svgScript'
    },
    plugins
  },
  {
    input: resolveFile('./src/plugins/vite-svg-loader.js'),
    output: {
      file: resolveFile('./dist/vite-svg-loader.umd.js'),
      format: 'umd',
      sourcemap: true,
      name: 'svgScript'
    },
    plugins
  }
];
