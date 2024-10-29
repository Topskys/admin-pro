export default {
  path: '/',
  name: 'Layout',
  redirect: '/home',
  component: () => import(/* webpackChunkName: "home" */ '@/layout/index.vue'),
  meta: {
    role: ['common', 'admin'],
    parentRouter: 'Home'
  },
  children: [
    {
      path: '/home',
      name: 'HomePage',
      component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
      meta: {
        isShow: true,
        title: '首页',
        parentRouter: 'Layout'
      }
    },
    {
      path: '/search',
      name: 'SearchPage',
      component: () => import(/* webpackChunkName: "search" */ '@/views/search/index.vue'),
      meta: {
        title: '搜索',
        isShow: true,
        parentRouter: 'Layout'
      }
    },
    {
      path: '/setting',
      name: 'SettingPage',
      component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/index.vue'),
      meta: {
        title: '设置',
        isShow: true,
        parentRouter: 'Layout'
      }
    }
  ]
};
