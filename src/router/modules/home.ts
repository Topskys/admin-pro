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
    // {
    //   path: '/p',
    //   name: 'ParentPage',
    //   meta: {
    //     isShow: true,
    //     title: '父菜单',
    //     parentRouter: 'Layout'
    //   },
    //   children: [
    //     {
    //       path: '/p/child1',
    //       name: 'ChildPage1',
    //       meta: {
    //         isShow: true,
    //         title: '子菜单1',
    //         parentRouter: 'ParentPage'
    //       }
    //     },
    //     {
    //       path: '/p/child2',
    //       name: 'ChildPage2',
    //       meta: {
    //         isShow: true,
    //         title: '子菜单2',
    //         parentRouter: 'ParentPage'
    //       }
    //     },
    //     {
    //       path: '/p/child3',
    //       name: 'ChildPage3',
    //       meta: {
    //         isShow: true,
    //         title: '子菜单3',
    //         parentRouter: 'ParentPage'
    //       }
    //     }
    //   ]
    // },
    // {
    //   path: '/project',
    //   name: 'projectPage',
    //   component: () => import(/* webpackChunkName: "home" */ '@/views/project/index.vue'),
    //   meta: {
    //     isShow: true,
    //     title: '项目模块',
    //     parentRouter: 'Layout'
    //   }
    // },
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
    }
  ]
};
