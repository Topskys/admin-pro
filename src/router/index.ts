import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

// 配置路由
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/home/index.vue"),
    meta: {},
    children: [],
  },
];

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
