import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/index.less';
import { registerECharts } from './plugins/echarts';
import monitor from '../monitor/dist/monitor.esm.js'; // 性能监控
import ErrorStackParser from 'error-stack-parser';
import { findCodeBySourcemap } from './utils';

const app = createApp(App);
app.use(router);
app.use(store);
// app.use(monitor, {
//   url: 'http://localhost:8000/reportData'
// });
registerECharts(app); // 注册echarts插件
app.mount('#app');

/**
 * sourcemap线上错误精确还原源代码
 */
app.config.errorHandler = function (err, vm, info) {
  const errorStack = ErrorStackParser.parse(err as Error);
  findCodeBySourcemap(errorStack[0]);
  console.log('errorStack', errorStack);
};
