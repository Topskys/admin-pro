import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

// 整体导入路由文件（默认是懒加载）
const modules: Record<string, any> = import.meta.glob("./modules/*.ts", {
  eager: true /* 取消懒加载 */,
});

// 配置路由
const routes: Array<RouteRecordRaw> = [];
Object.keys(modules).forEach((key) => routes.push(modules[key].default));

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start();
  next();
});

router.afterEach(() => {
  // 进度条结束
  NProgress.done();
});
