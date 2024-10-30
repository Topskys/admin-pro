<template>
  <!-- 开启顶部安全区适配 -->
  <van-nav-bar title="标题" safe-area-inset-top />
  <!-- 路由占位 -->
  <router-view></router-view>
  <!-- 开启底部安全区适配 -->
  <van-number-keyboard safe-area-inset-bottom />
</template>

<script setup lang="ts"></script>
<style lang="less">
#app {
  height: inherit;
}
</style>
