import { createRouter, createWebHashHistory, createWebHistory, RouteLocationNormalizedGeneric, RouteRecordRaw } from 'vue-router';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { useSettingStore } from '@/store/setting';
import { useBoardStore } from '@/store/board';

// 整体导入路由文件（默认是懒加载）
const modules: Record<string, any> = import.meta.glob('./modules/*.ts', {
  eager: true /* 取消懒加载 */
});

// 配置路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/data-view',
    name: 'DataViewPage',
    component: () => import('@/views/data-view/index.vue'),
    meta: {
      isShow: true,
      title: '数据大屏'
    }
  }
];
Object.keys(modules).forEach((key) => routes.push(modules[key].default));

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

// 白名单，不需要登录就可以访问的页面
const whiteList = ['/login', '/404', '/403'];
// 处理面包屑路由
const settingStore = useSettingStore();
export const getTitle = (name: string, routes: RouteRecordRaw[]) => {
  const names: string[] = [];
  while (true) {
    names.push(name);
    const currentRoute = routes.find((route) => route.name === name);
    const parentRoute = routes.find((route) => route.name === currentRoute?.meta?.parentRouter);
    if (parentRoute) {
      name = parentRoute.name as string;
      continue;
    } else {
      break;
    }
  }
  return names.reverse();
};
const handleRouters = (to: RouteLocationNormalizedGeneric) => {
  const { name: currentName } = to;
  const titles = getTitle(currentName as string, router.getRoutes());
  settingStore.setTitle(titles);
};
  
/**
 * 路由守卫
 */
router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start();


  // TEST: 测试从store获取数据来修改website title
const boardStore = useBoardStore(); // 可以移出到函数外层
  // const { result } = storeToRefs(boardStore);
  // console.log('🚀 ~ router.beforeEach ~ result.value1:', boardStore.getCount());
  // ok 1
  // const result = JSON.parse(localStorage.getItem('board') as string);
  // console.log("🚀 ~ file: index.ts:71 ~ result :", result )
  // document.title = `数据大屏-${result.result.count}`;
  // ok 2
  document.title = `数据大屏-${boardStore.getCount()}`;
  next(()=>{
    // const { result } = storeToRefs(boardStore);
    console.log('🚀 ~ router.beforeEach ~ result.value2:', boardStore.result, boardStore.getCount());
    // document.title = `数据大屏-${boardStore.result?.count}`;
    // document.title = `数据大屏-${result?.count}`;
  });
});

router.afterEach(() => {
  // 进度条结束
  NProgress.done();
});
