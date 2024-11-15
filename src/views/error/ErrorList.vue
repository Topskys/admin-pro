<template>
  <div v-if="isErr">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="(item, index) in js_error.stack_frames" :key="index" :title="item.source" :name="index">
        <el-row :gutter="20">
          <el-col :span="20">{{ item.fileName }}</el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="openDialog(item, index)">映射源码</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <template v-if="item.originalSource">{{ item.originalSource }}</template>
          <template v-else>{{ item.functionName }}</template>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <el-dialog v-model="dialogVisible" title="SourceMap源码映射" width="500">
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="本地上传" name="local">
          <el-upload drag :before-upload="sourcemapUpload">
            <i class="el-icon-upload"></i>
            <div>将文件拖拽到此处，或者<em>点击上传</em></div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="远程加载" name="remote"> </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import sourceMap from 'source-map-js';

const js_error = ref<any>([]);
const isErr = ref(false);
const activeNames = ref('1');
const dialogVisible = ref(false);
const tabActiveName = ref('local');
let stackFrameObj = {
  line: 0,
  column: 0,
  index: null
};

const getErrorList = () => {
  try {
    const errorString = localStorage.getItem('jsErrorList');
    if (!errorString) return;
    js_error.value = JSON.parse(errorString);
    isErr.value = true;
  } catch (error: any) {
    console.log('获取错误列表失败', error);
  }
};

onMounted(() => {
  getErrorList();
});

const handleChange = (val: string) => {
  //   console.log(val);
};

const openDialog = (item: any, index: number) => {
  dialogVisible.value = true;
  stackFrameObj = {
    line: item.lineNumber,
    column: item.columnNumber,
    index: index
  };
};

const sourcemapUpload = async (file: any) => {
  if (file.name.substring(file.name.lastIndexOf('.') + 1) !== 'map') {
    ElMessage({
      message: '请上传正确的sourcemap文件',
      type: 'error'
    });
    return;
  }
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = async function (e: any) {
    const code = await getSource(e?.target?.result, stackFrameObj.line, stackFrameObj.column);
    js_error.value.stack_frames[stackFrameObj.index].originalSource = code?.source;
    dialogVisible.value = false;
  };
};

const getSource = async (sourcemap: any, line: number, column: number) => {
  try {
    const consumer = await new sourceMap.SourceMapConsumer(JSON.parse(sourcemap));
    const originalPosition = consumer.originalPositionFor({ line, column });
    const source = consumer.sourceContentFor(originalPosition.source);
    console.log('source', source);
    return {
      source: source,
      line: originalPosition.line,
      column: originalPosition.column
    };
  } catch (e) {
    ElMessage.error('sourcemap解析失败');
  }
};
</script>
