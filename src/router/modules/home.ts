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
      path: '/user',
      name: 'UserPage',
      component: () => import(/* webpackChunkName: "user" */ '@/views/user/index.vue'),
      meta: {
        title: '用户模块',
        isShow: true,
        parentRouter: 'Layout'
      }
    },
    {
      path: '/role',
      name: 'RolePage',
      component: () => import(/* webpackChunkName: "role" */ '@/views/role/index.vue'),
      meta: {
        title: '角色模块',
        isShow: true,
        parentRouter: 'Layout'
      }
    },
    {
      path: '/auth',
      name: 'AuthPage',
      component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/index.vue'),
      meta: {
        title: '权限模块',
        isShow: true,
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
    },
    {
      path: '/project',
      name: 'projectPage',
      component: () => import(/* webpackChunkName: "home" */ '@/views/project/index.vue'),
      meta: {
        isShow: true,
        title: '项目模块',
        parentRouter: 'Layout'
      }
    },
    {
      path: '/p',
      name: 'ParentPage',
      meta: {
        isShow: true,
        title: '父菜单',
        parentRouter: 'Layout'
      },
      children: [
        {
          path: '/p/child1',
          name: 'ChildPage1',
          meta: {
            isShow: true,
            title: '子菜单1',
            parentRouter: 'ParentPage'
          }
        },
        {
          path: '/p/child2',
          name: 'ChildPage2',
          meta: {
            isShow: true,
            title: '子菜单2',
            parentRouter: 'ParentPage'
          }
        },
        {
          path: '/p/child3',
          name: 'ChildPage3',
          meta: {
            isShow: true,
            title: '子菜单3',
            parentRouter: 'ParentPage'
          }
        }
      ]
    },
    {
      path: '/errorView',
      name: 'ErrorViewPage',
      component: () => import('@/views/sourcemap/ErrorView.vue'),
      meta: {
        isShow: true,
        title: '生产错误'
      }
    },
    {
      path: '/errorList',
      name: 'ErrorListPage',
      component: () => import('@/views/sourcemap/ErrorList.vue'),
      meta: {
        isShow: true,
        title: '错误列表'
      }
    },
    {
      path: '/recordScreen',
      name: 'RecordScreenPage',
      component: () => import('@/views/rrweb/RecordScreen.vue'),
      meta: {
        isShow: true,
        title: 'rrweb录屏'
      }
    },
    {
      path: '/playScreen',
      name: 'PlayScreenPage',
      component: () => import('@/views/rrweb/PlayScreen.vue'),
      meta: {
        isShow: true,
        title: '播放录屏'
      }
    },
    {
      path: '/watermark',
      name: 'WatermarkPage',
      component: () => import('@/views/watermark/index.vue'),
      meta: {
        isShow: true,
        title: '水印测试'
      }
    },
    {
      path: '/video',
      name: 'VideoPage',
      component: () => import('@/views/video/index.vue'),
      meta: {
        isShow: true,
        title: '视频播放'
      }
    },
    {
      path: '/theme',
      name: 'Theme',
      component: () => import('@/views/theme/index.vue'),
      meta: {
        isShow: true,
        title: '切换主题'
      }
    },
    {
      path: '/use-axios',
      name: 'UseAxiosPage',
      component: () => import('@/views/use-axios/index.vue'),
      meta: {
        isShow: true,
        title: '請求鉤子'
      }
    },
    {
      path: '/image',
      name: 'ImagePage',
      component: () => import('@/views/image/index.vue'),
      meta: {
        isShow: true,
        title: '图片处理'
      }
    },
    {
      path: '/icon',
      name: 'IconPage',
      component: () => import('@/views/icon/index.vue'),
      meta: {
        isShow: true,
        title: 'SVG图标'
      }
    }
  ]
};
