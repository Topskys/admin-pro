<template>
  <div class="layout">
    <router-view />
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/search" icon="search">搜索</van-tabbar-item>
      <van-tabbar-item replace to="/setting" icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
let active = ref<string>('/home');
</script>
<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
