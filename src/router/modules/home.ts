export default {
  path: '/',
  name: 'Layout',
  redirect: '/',
  component: () => import(/* webpackChunkName: "home" */ '@/layout/index.vue'),
  meta: {
    role: ['common', 'admin'],
    parentRouter: 'Home'
  },
  children: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
      meta: {
        isShow: true,
        title: '默认首页',
        parentRouter: 'Layout'
      }
    },
    {
      path: '/about',
      name: 'AboutPage',
      component: () => import(/* webpackChunkName: "about" */ '@/views/about/index.vue'),
      meta: {
        title: '关于模块',
        isShow: true,
        parentRouter: 'Layout'
      }
    }
  ]
};
