<script setup lang="ts">
import VScaleScreen from 'v-scale-screen';
import BaseChart from '@/components/chart/base-chart.vue';
import { useAutoScale } from '@/hooks/useAutoScale';
import { useCountdown } from '@/hooks/useCountdown';
import { createUseComputed } from '@/hooks/useComputed';
import { useBoardStore } from '@/store/board';

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
});

onMounted(() => {
  useAutoScale('.data-view');
  setInterval(() => {
    lineOption.series[0].data = Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 100));
    barOption.series[0].data = Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 100));
    console.log('🚀 ~ setInterval ~ barOption:', barOption, lineOption);
  }, 10000);
});

const boardStore = useBoardStore();
const { result } = storeToRefs(boardStore);

// const { remaining, used } = useCountdown('23:59:59');
const sum = createUseComputed((a, b) => a + b)(1, 2);

const countDown = ref<any>(null);
const remaining2 = ref(null);
const used2 = ref(null);
countDown.value = useCountdown('23:59:59');
watch(
  () => result.value,
  () => {
    console.log('🚀 ~ watch ~ result:', result.value);
    countDown.value.start();
    const { remaining, used } = countDown.value;
    remaining2.value = remaining;
    used2.value = used;
  },
  {
    deep: true
  }
);
</script>

<template>
  <VScaleScreen>
    <div class="data-view flex-col">
      倒计时：{{ remaining2 }} 已使用时间 ： {{ used2 }}, 总和：{{ sum }}- {{ result }}
      <el-row :gutter="10" class="row">
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
      <el-row :gutter="10" class="row">
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
      <footer>
        <BaseChart :option="lineOption" />
      </footer>
    </div>
  </VScaleScreen>
</template>

<style lang="scss" scoped>
.flex-col {
  display: flex;
  flex-direction: column;
  width: 1920px;
  height: 1080px;
  height: 100%;
  overflow: hidden;
  background-color: #f0f0f0;

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

<!-- <template>
    <VScaleScreen>  
        <div class="chart-container">
    <img src="/20250331221126.png" alt="" style="width: 100%;height: 100%">
  </div>
</VScaleScreen>

</template>

<script setup lang="ts">
import echarts from '@/plugins/echarts';
import { ref, onMounted } from 'vue';
import BaseChart from '@/components/chart/base-chart.vue';
import { useAutoScale } from '@/hooks/useAutoScale';
import VScaleScreen from 'v-scale-screen';

const option = ref({
  title: {
    text: 'Traffic Sources',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines']
  },
  series: [
    {
      name: 'Traffic Sources',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 234, name: 'Ad Networks' },
        { value: 135, name: 'Video Ads' },
        { value: 1548, name: 'Search Engines' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});

onMounted(() => {
  useAutoScale('img', { designWidth: 1920, designHeight: 1080 });
//   echarts.init(document.querySelector('.chart-container') as HTMLElement).setOption(option.value);
});
</script>

<style lang="less" scoped>
.chart-container {
  width: 100%;
  height: 100%;
  //   设置比例
background-color: antiquewhite;

}

.chart {
  height: 100vh;
  // overflow: hidden;
}
</style> -->
