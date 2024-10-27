<template>
  <el-container>
    <el-header>
      <Header />
    </el-header>
    <el-container class="main-container">
      <el-aside>
        <Aside />
      </el-aside>
      <el-main>
        <Breadcrumb />
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
import Aside from './components/Aside.vue';
import Breadcrumb from './components/Breadcrumb.vue';
</script>
<style lang="less" scoped>
.el-header {
  padding: 0;
  margin-bottom: 5px;
}

.el-container {
  height: 100%;

  .el-aside {
    width: 200px;
    height: 100%;
    // height: calc(100vh - 65px);
  }

  .el-menu {
    height: 100%;
  }

  .el-main {
    padding: 20px;
  }
}

.main-container {
  height: calc(100vh - 65px);
}

.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
