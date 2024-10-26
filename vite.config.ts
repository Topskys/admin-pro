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
      Components({
        resolvers: [ElementPlusResolver(), IconsResolver()],
        dts: fileURLToPath(new URL('./types/components.d.ts', import.meta.url))
      }),
      Icons({ autoInstall: true }),
      // 打包分析插件
      visualizer({
        gzipSize: true,
        brotliSize: true,
        // emitFile: false,
        // filename: "test.html", //分析图生成的文件名
        open: true //如果存在本地服务端口，将在打包后自动展示
      }),
      // 压缩插件
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 1024 * 10, // 10mb
        algorithm: 'brotliCompress',
        ext: '.br',
        deleteOriginFile: true //打包后是否删除源文件
      }),
      // 自动按需引入CDN插件
      importToCDN({
        modules: [
          {
            name: 'echarts',
            var: 'echarts',
            path: 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js'
          }
        ]
      })
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
      // 关闭 sorcemap 报错不会映射到源码
      sourcemap: false,
      // 打包大小超出 400kb 提示警告
      chunkSizeWarningLimit: 400,
      rollupOptions: {
        // 打包入口文件 根目录下的 index.html
        // 也就是项目从哪个文件开始打包
        input: {
          index: fileURLToPath(new URL('./index.html', import.meta.url))
        },
        // 静态资源分类打包
        output: {
          format: 'esm',
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
          // 将echarts分开打包
          // manualChunks: {
          //   echarts: ["echarts"]
          // }
        }
        // 配置外部依赖（不需要打包）
        // external: ["echarts"]
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
