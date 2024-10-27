<template>
  <el-menu :default-active="activeMenu" class="el-menu-vertical" :collapse="isCollapse" router>
    <template v-for="menu in menuList" :key="menu.path">
      <el-menu-item v-if="!menu.children" :index="menu.path">
        {{ menu.meta?.title }}
      </el-menu-item>
      <el-sub-menu v-else :index="menu.path">
        <template #title>
          <span>{{ menu.meta?.title }}</span>
        </template>
        <el-menu-item v-for="sub in menu.children" :key="sub.path" :index="sub.path">
          <span>{{ sub.meta?.title }}</span>
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
// 根据路由表生成菜单列表
// 获取到的是扁平路由
// const menuList = router.getRoutes().filter((route: any) => {
// 获取保持到的是嵌套路由
const menuList = router.options.routes[0].children!.filter((route: any) => {
  return route.meta?.isShow;
});
// 折叠菜单
const isCollapse = ref(false);
// 当前路由的path
const activeMenu = route.path;
</script>
