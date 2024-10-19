import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 初始化Pinia状态管理库
const pinia = createPinia();
// 使用持久化插件
pinia.use(piniaPluginPersistedstate);

export default pinia;
