<template>
  <div class="header">
    <div class="flex-center">logo</div>
    <div class="flex-grow"></div>
    <div class="flex-center m05 color-dark-black">
      <i-ep-user></i-ep-user>
      {{ username }}
    </div>
    <div class="flex-center m05 color-dark-black setting" @click="handleSetting">
      <i-ep-setting></i-ep-setting>
    </div>
  </div>
  <el-drawer
    v-model="showSetting"
    title="设置"
    size="30%"
    direction="rtl"
    :width-header="false"
    :show-close="false"
    append-to-body
  >
    <div class="setting-header">
      <h2>项目配置</h2>
      <i-ep-close @click="handlerClose"></i-ep-close>
    </div>
    <div class="logout">
      <el-button type="primary" @click="logout">退出</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { useUserStoreHook } from '@/store/user';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

let showSetting = ref(false);
const router = useRouter();
const { username } = useUserStoreHook();

const handleSetting = () => {
  showSetting.value = !showSetting.value;
};
const handlerClose = () => {
  showSetting.value = false;
};
const logout = () => {
  sessionStorage.removeItem('userInfo');
  router.push('/login');
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  padding: 0 15px;
  margin-bottom: 5px;
  width: 100%;
  height: 60px;
  box-shadow: 0 0 20px rgb(195 223 252/40%);
  line-height: 60px;
}

.setting {
  cursor: pointer;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  color: var(--dawei-color-dark-black);
}

.logout {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
