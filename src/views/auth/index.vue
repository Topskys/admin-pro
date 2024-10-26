<template>
  <div class="container">
    <el-tree
      ref="treeRef"
      :data="authList"
      :props="{
        children: 'roleList',
        label: 'name'
      }"
      show-checkbox
      node-key="roleId"
      default-expand-all
      highlight-current
      :check-strictly="true"
      :default-checked-keys="checkedNode"
    ></el-tree>
    <el-button type="primary" @click="onChangeAuth">修改权限</el-button>
  </div>
</template>
<script setup lang="ts">
import { getAuthList } from '@/api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { query } = route;

interface IAuth {
  name: string;
  roleId: number;
  roleList?: IAuth[]; // 角色列表 子权限
}

let authList = ref<IAuth[]>([]);
let treeRef = ref<any>(null);
let checkedNode = ref<number[]>([]);

// 如果路由有参数，则tree默认选中
if (query.auth) {
  checkedNode.value = query.auth as any[];
}

const fetchAuthList = () => {
  getAuthList().then((res) => {
    authList.value = res;
  });
};

onMounted(() => {
  fetchAuthList();
});

const onChangeAuth = () => {
  const selectedTreeNode = treeRef.value.getCheckedNodes();
};
</script>
