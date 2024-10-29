<template>
  <div class="container">
    setting
    <van-button type="primary" @click="settingStore.addCount">{{ settingStore.count }}</van-button>
  </div>
</template>
<script setup lang="ts">
import { useSettingStore } from '@/store/setting';

const settingStore = useSettingStore();
</script>
<style scoped lang="less">
.container {
  padding: 10px 0 0 10px;
}
</style>
