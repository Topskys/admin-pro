<template>
  <el-menu :default-active="activeMenu" class="el-menu-vertical" :collapse="isCollapse" router>
    <el-menu-item v-for="menu in menuList" :key="menu.path" :index="menu.path">
      {{ menu.meta.title }}
    </el-menu-item>
  </el-menu>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
// 根据路由表生成菜单列表
const menuList = router.getRoutes().filter((route: any) => {
  return route.meta.isShow;
});
// 折叠菜单
const isCollapse = ref(false);
// 当前路由的path
const activeMenu = route.path;
</script>
