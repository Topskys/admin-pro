<!-- <template>
  <div class="container">
    <Tag text="CustomTag" theme="blue"></Tag>
    <svg-icon name="refresh" color=""></svg-icon>
    <Tag text="测试自定义组件" theme="blue"></Tag>
    <svg-icon name="config" stroke=""></svg-icon>
    <svg-icon name="user"></svg-icon>
    <svg-icon name="user1"></svg-icon>
    <svg-icon name="user2" style=""></svg-icon>
    <svg-icon name="home"></svg-icon>
  </div>
</template>
<script setup lang="ts">
// 构建工具自动注册组件
// import CustomTag from '@/components/Tag.vue';

</script>

<style scoped>
.container {
  /* color: red; */
  font-size: 16px;
}
</style> -->

<template>
  <!-- <iconSvg name="home"></iconSvg> -->
  <img :src="getImgUrl('home.svg')" alt=""/>
  <div ref="chartContainer" style="width: 600px; height: 400px"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import echarts from '@/plugins/echarts';
import iconSvg from './iconSvg.vue'; // 导入组件
import { getImgUrl } from '@/utils';

const chartContainer = ref(null);
let mainChart = null;
const tooltipCharts = new Map(); // 存储所有 tooltip 图表实例

// 主图表配置
const mainOption = {
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      const dataIndex = params[0].dataIndex;
      const containerId = `tooltip-chart-${dataIndex}`;

      // 返回带图表的 HTML 结构
      return `
        <div class="custom-tooltip">
          <h4>${params[0].name} 详情</h4>
          <div id="${containerId}" style="width: 300px; height: 180px;"></div>
        </div>
      `;
    }
  },
  xAxis: {
    type: 'category',
    data: ['类别A', '类别B', '类别C', '类别D', '类别E']
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [120, 200, 150, 80, 70],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 1, color: '#188df0' }
        ])
      }
    }
  ]
};

// 初始化 tooltip 中的图表
function initTooltipChart(containerId, dataIndex) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 销毁已存在的实例
  if (tooltipCharts.has(containerId)) {
    tooltipCharts.get(containerId).dispose();
  }

  const chart = echarts.init(container);
  tooltipCharts.set(containerId, chart);

  // 嵌套图表数据 (示例数据)
  const subData = [
    [15, 25, 30, 40, 10],
    [20, 35, 25, 45, 15],
    [10, 30, 20, 35, 25],
    [25, 15, 35, 20, 30],
    [30, 40, 10, 25, 35]
  ];

  chart.setOption({
    grid: { top: 20, right: 10, bottom: 30, left: 40 },
    xAxis: {
      type: 'category',
      data: ['子类1', '子类2', '子类3', '子类4', '子类5']
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: subData[dataIndex],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#36cfc9' },
            { offset: 1, color: '#096dd9' }
          ])
        }
      }
    ]
  });
}

// 初始化主图表
function initMainChart() {
  if (!chartContainer.value) return;

  mainChart = echarts.init(chartContainer.value);
  mainChart.setOption(mainOption);

  // 监听 tooltip 事件
  mainChart.on('showTip', (params) => {
    // if (params.type === 'showTip') {
      const dataIndex = params.dataIndex;
      const containerId = `tooltip-chart-${dataIndex}`;
      setTimeout(() => initTooltipChart(containerId, dataIndex), 0);
    // }
  });

  // 销毁 tooltip 图表
  mainChart.on('hideTip', () => {
    tooltipCharts.forEach((chart) => chart.dispose());
    tooltipCharts.clear();
  });
}

onMounted(() => {
  initMainChart();
  window.addEventListener('resize', () => mainChart?.resize());
});

onBeforeUnmount(() => {
  mainChart?.dispose();
  tooltipCharts.forEach((chart) => chart.dispose());
  window.removeEventListener('resize', () => mainChart?.resize());
});
</script>

<style scoped>
/* 确保 tooltip 内容可见 */
.custom-tooltip {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>



https://blog.csdn.net/m0_52313178/article/details/124371540

https://juejin.cn/post/7154328903069204493