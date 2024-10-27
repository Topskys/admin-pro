<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in settingStore.title" :key="item" :to="{ name: item }">{{
      item
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup lang="ts">
import { useSettingStore } from '@/store/setting';
import { ArrowRight } from '@element-plus/icons-vue';

const settingStore = useSettingStore();
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
