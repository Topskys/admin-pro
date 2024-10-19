import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 初始化Pinia状态管理库
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
