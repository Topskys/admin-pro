import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/index.less';
import { registerECharts } from './plugins/echarts';
import monitor from '../monitor/dist/monitor.esm.js'; // 性能监控

const app = createApp(App);
app.use(router);
app.use(store);
app.use(monitor, {
  url: 'http://localhost:8000/reportData'
});
registerECharts(app); // 注册echarts插件
app.mount('#app');
