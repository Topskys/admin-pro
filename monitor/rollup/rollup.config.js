const path = require('path');
const json = require('@rollup/plugin-json');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');

const resolveFile = function (filePath) {
  return path.join(__dirname, filePath);
};

const plugins = [
  babel({
    extensions: ['.js', '.ts'],
    babelHelpers: 'bundled',
    // exclude: 'node_modules/**',
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
    input: resolveFile('../src/webEyeSDK.js'),
    output: {
      file: resolveFile('../dist/monitor.js'),
      format: 'iife', // 適合<script>标签引入的脚本
      sourcemap: true,
      name: 'monitor'
    },
    plugins
  },
  {
    input: resolveFile('../src/webEyeSDK.js'),
    output: {
      file: resolveFile('../dist/monitor.min.js'),
      format: 'iife', // 適合<script>标签引入的脚本
      sourcemap: true,
      name: 'monitor',
      plugins: [terser()] // 压缩
    },
    plugins
  },
  {
    input: resolveFile('../src/webEyeSDK.js'),
    output: {
      file: resolveFile('../dist/monitor.esm.js'),
      format: 'esm',
      sourcemap: true,
      name: 'monitor'
    },
    plugins
  },
  {
    input: resolveFile('../src/webEyeSDK.js'),
    output: {
      file: resolveFile('../dist/monitor.cjs.js'),
      format: 'cjs',
      sourcemap: true,
      name: 'monitor'
    },
    plugins
  },
  {
    input: resolveFile('../src/webEyeSDK.js'),
    output: {
      file: resolveFile('../dist/monitor.umd.js'),
      format: 'umd',
      sourcemap: true,
      name: 'monitor'
    },
    plugins
  }
];
