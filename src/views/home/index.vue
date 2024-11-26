<template>
  <div class="home">
    <el-form inline :model="searchData" class="search-form">
      <el-form-item label="项目名称">
        <el-input v-model="searchData.title" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="项目详情">
        <el-input v-model="searchData.introduce" placeholder="请输入项目详情" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column prop="id" label="编号" width="180" />
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="introduce" label="描述" />
    </el-table>
    <el-pagination
      v-model:current-page="searchData.currentPage"
      v-model:page-size="searchData.pageSize"
      background
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      size="default"
      layout="total,prev, pager, next,sizes"
      :total="searchData.dataCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
interface IProject {
  id: number;
  userId: number;
  title: string;
  introduce: string;
}

let projectList = ref<IProject[]>([]);
let searchData = reactive({
  currentPage: 1,
  pageSize: 10,
  dataCount: 0, // total
  title: '',
  introduce: ''
});

// 请求项目列表总数据
const fetchData = () => {
  projectList.value = [
    { id: 1, userId: 102, title: '测试项目', introduce: '测试项目描述' },
    { id: 2, userId: 103, title: '测试项目2', introduce: '测试项目2描述' }
  ];
  searchData.dataCount = projectList.value.length;
};

onMounted(() => {
  fetchData();
});

// 计算分页数据
let dataList = computed(() => {
  return projectList.value.slice(
    (searchData.currentPage - 1) * searchData.pageSize,
    searchData.currentPage * searchData.pageSize
  );
});

// 页面发生改变
const handleCurrentChange = (val: number) => {
  searchData.currentPage = val;
};
// 每页条数发生改变
const handleSizeChange = (val: number) => {
  searchData.pageSize = val;
};

// 搜索
const onSearch = () => {
  let result: IProject[] = projectList.value;
  if (searchData.title) {
    result = projectList.value.filter((item) => item.title.indexOf(searchData.title) > -1);
  }
  if (searchData.introduce) {
    result = projectList.value.filter((item) => item.introduce.indexOf(searchData.introduce) > -1);
  }
  projectList.value = result;
  searchData.currentPage = 1;
  searchData.dataCount = result.length;
};

// 监听搜索条件变化重新发起请求
watch([() => searchData.title, () => searchData.introduce], () => {
  fetchData();
});
</script>
