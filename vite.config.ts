import { defineConfig, loadEnv } from 'vite';
import type { UserConfig, ConfigEnv } from 'vite';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { viteMockServe } from 'vite-plugin-mock';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite'; // css
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { autoComplete, Plugin as importToCDN } from 'vite-plugin-cdn-import';
import externalGlobals from 'rollup-plugin-external-globals';
import brotli from 'rollup-plugin-brotli';
import { createHtmlPlugin } from 'vite-plugin-html'; // 自动导入cdn
import { manualChunksPlugin } from 'vite-plugin-webpackchunkname';

// 不加入打包使用外链
const globals = externalGlobals({
  mement: 'moment',
  jspdf: 'jspdf',
  xlsx: 'XLSX',
  echarts: 'echarts',
  'video.js': 'videojs'
});

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 获取当前工作目录
  const root = process.cwd();
  // 获取环境变量
  const env = loadEnv(mode, root);
  console.log(env);
  return {
    // 项目根目录
    root,
    // 项目部署的基础路径
    base: './',
    publicDir: fileURLToPath(new URL('./public', import.meta.url)), // 无需处理的静态资源位置
    assetsInclude: fileURLToPath(new URL('./src/assets', import.meta.url)), // 需要处理的静态资源位置
    // css预处理
    css: {
      preprocessorOptions: {
        less: {
          // 优化：将变量文件导入每个组件中
          additionalData: `@import "@/styles/variable.less";`
        }
      }
    },
    plugins: [
      // Vue模板文件编译插件
      vue(),
      // jsx文件编译插件
      vueJsx(),
      // 开启mock服务器
      viteMockServe({
        // 如果接口为 /mock/xxx 以 mock 开头就会被拦截响应配置的内容
        mockPath: 'mock', // 数据模拟需要拦截的请求起始 URL
        enable: true // 本地环境是否开启 mock 功能
      }),
      ElementPlus({}),
      // 自动按需引入插件
      AutoImport({
        // 自动导入vue相关函数
        imports: ['vue', 'vue-router', 'pinia'],
        // 处理eslint
        eslintrc: {
          enabled: true
        },
        // 自动导入element-plus相关函数
        resolvers: [ElementPlusResolver(), IconsResolver()],
        dts: fileURLToPath(new URL('./types/auto-imports.d.ts', import.meta.url))
      }),
      // 自动注册组件
      Components({
        resolvers: [ElementPlusResolver(), IconsResolver()],
        dts: fileURLToPath(new URL('./types/components.d.ts', import.meta.url)),
        dirs: fileURLToPath(new URL('./src/components/auto', import.meta.url)),
        // 只针对vue做处理（/* webpackChunkName: about */将某个组件打成单个文件时）
        include: [/\.vue$/, /\.vue\?/]
      }),
      Icons({ autoInstall: true }),
      // 打包分析插件
      visualizer({
        gzipSize: true,
        brotliSize: true,
        // emitFile: false,
        // filename: "test.html", //分析图生成的文件名
        open: false // 如果存在本地服务端口，将在打包后自动展示
      }),
      // 压缩插件
      // viteCompression({
      //   verbose: true,
      //   disable: false,
      //   threshold: 1024 * 10, // 超过10mb才进行压缩
      //   algorithm: 'brotliCompress',
      //   ext: '.br',
      //   deleteOriginFile: true //打包后是否删除源文件
      // }),
      // brotli({}),
      // 自动按需引入CDN外链插件
      // importToCDN({
      //   modules: [
      //     {
      //       name: 'echarts',
      //       var: 'echarts',
      //       path: 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js'
      //     }
      //   ]
      // }),
      // or
      createHtmlPlugin({
        inject: {
          data: {
            // 需要再html中使用的变量<% echartsscript %>
            echartsscript: `<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>`
          }
        }
      }),
      globals, // 不加入打包使用外链（cdn）
      manualChunksPlugin() // 静态资源分类打包
    ],
    // 运行后本地预览的服务器
    server: {
      // 是否开启https
      // https: false,
      // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
      host: true,
      // 开发环境预览服务器端口
      port: 9000,
      // 启动后是否自动打开浏览器
      open: false,
      // 是否开启CORS跨域
      cors: true,
      // 代理服务器
      // 帮助我们开发时解决跨域问题
      proxy: {
        // 这里的意思是 以/api开头发送的请求都会被转发到 http://xxx:9000
        [env.VITE_APP_API_BASEURL]: {
          target: 'http://localhost:9000',
          // 改变 Host Header
          changeOrigin: true
          // 发起请求时将 '/api' 替换为 ''
          //rewrite: (path) => path.replace(/^\/api/, ""),
        },
        [env.VITE_APP_MOCK_BASEURL]: {
          target: 'http://localhost:9000',
          // 改变 Host Header
          changeOrigin: true
          // 发起请求时将 '/api' 替换为 ''
          //rewrite: (path) => path.replace(/^\/api/, ""),
        }
      }
    },
    // 打包配置
    build: {
      // 关闭 sourcemap 报错不会映射到源码
      // 優化：開啟 sourcemap 讓線上报错精確映射到源码，打包体积变大且暴露業務源碼，不可取，
      // 用error-stack-parser和 source-map-js，且sourcemap 开启，sourcemap线上换进会放其他服务器
      sourcemap: true,
      // 打包大小超出 400kb 提示警告
      chunkSizeWarningLimit: 400,
      rollupOptions: {
        // 打包入口文件 根目录下的 index.html
        // 也就是项目从哪个文件开始打包
        input: {
          index: fileURLToPath(new URL('./index.html', import.meta.url))
        },
        // 检测模块的副作用，以避免将无副作用的模块打包到一起
        // experimentalLogSideEffects: true,
        // tree shaking
        treeshake: {
          preset: 'recommended'
        },
        // 静态资源分类打包
        output: {
          // 将依赖单独打包到 vendor 文件中，但无法很好的利用缓存
          manualChunks: (id: string) => {
            // html2canvas只有极少数页面使用，故需要单独处理
            if (id.includes('html2canvas')) {
              return 'html2canvas';
            }
            // 将about页面打成一个文件
            // if (id.includes('src/views/about')) {
            //   return 'about';
            // }
            // 使用unplugin-vue-component和vite-plugin-webpackchunkname将about页面打成一个文件
            // 如果node_modules非常大，可以考虑外链的形式 rollup-plugin-external-globals
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('src/views/error/ErrorView')) {
              return 'errorView';
            }
            return 'index';
          },
          // 将小于 20kb 的模块合并到一个文件中，以更好地利用缓存（rollup@3.3+），有副作用代码则无效，需要manualChunks配合
          experimentalMinChunkSize: 20 * 1024
        }
        // output: {
        // 将依赖单独打包到 vendor 文件中，并利用缓存
        // format: 'esm',
        // chunkFileNames: 'static/js/[name]-[hash].js',
        // entryFileNames: 'static/js/[name]-[hash].js',
        // assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        // 将echarts分开打包
        // manualChunks: {
        //   echarts: ["echarts"]
        // }
        // }
        // 配置外部依赖（不需要打包）
        // external: ['echarts', 'html2canvas', 'jspdf', 'moment', 'videojs', 'xlsx']
      }
    },
    // 配置别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url))
      }
    }
  };
});
