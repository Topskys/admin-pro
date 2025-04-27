<script setup lang="ts">
import BaseChart from '@/components/chart/base-chart.vue';

const lineOption = reactive({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
    data: Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 100)),
      type: 'line'
    }
  ]
});

const barOption = reactive({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 100)),
      type: 'bar'
    }
  ]
})

onMounted(() => {
  console.log('mounted')
  setInterval(() => {
    lineOption.series[0].data = Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 100));
    barOption.series[0].data = Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 100));
    console.log("🚀 ~ setInterval ~ barOption:", barOption, lineOption)
  }, 1000);
})
</script>

<template>
  <div class="flex-col">
    <el-row :gutter="10" class='row'>
      <el-col :span="6">
        <BaseChart :option="lineOption" />
      </el-col>
      <el-col :span="12">
        <BaseChart :option="barOption" />
      </el-col>
      <el-col :span="6">
        <BaseChart :option="lineOption" />
      </el-col>
    </el-row>
    <el-row :gutter="10" class='row'>
      <el-col :span="6">
        <BaseChart :option="barOption" />
      </el-col>
      <el-col :span="12">
        <BaseChart :option="lineOption" />
      </el-col>
      <el-col :span="6">
        <BaseChart :option="barOption" />
      </el-col>
    </el-row>
    <footer><BaseChart :option="lineOption" /></footer>
  </div>
</template>

<style lang="scss" scoped>
.flex-col {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  .row {
   flex: 1; 
   margin: 0 !important;
  }
  footer {
    width: 100%;
    height: 50px;
    // background-color: #f0f0f0;
  }
}
</style>
