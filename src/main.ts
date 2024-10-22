import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./styles/index.css";
import { registerECharts } from "./plugins/echarts";

const app = createApp(App);
app.use(router);
app.use(store);
registerECharts(app); // 注册echarts插件
app.mount("#app");
