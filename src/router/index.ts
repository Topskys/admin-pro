import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';

// 整体导入路由文件（默认是懒加载）
const modules: Record<string, any> = import.meta.glob('./modules/*.ts', {
  eager: true /* 取消懒加载 */
});

// 配置路由
const routes: Array<RouteRecordRaw> = [];
Object.keys(modules).forEach((key) => routes.push(modules[key].default));

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

// 白名单，不需要登录就可以访问的页面
const whiteList = ['/login', '/404', '/403'];

/**
 * 路由守卫
 */
router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start();
  const token = sessionStorage.getItem('userInfo');
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next();
    } else {
      next('/login');
    }
  }
});

router.afterEach(() => {
  // 进度条结束
  NProgress.done();
});
