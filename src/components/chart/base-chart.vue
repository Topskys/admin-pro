<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useChart } from '@/hooks/useChart';
import { ECOption } from '@/plugins/echarts';
import * as _ from 'lodash-es';

const props = defineProps<{
  option: Partial<ECOption>;
  theme?: string;
}>();

const chartRef = ref<HTMLDivElement | null>(null);

const chart = useChart(chartRef, { option: props.option, theme: props.theme });

watch(
  () => props.option,
  (newVal) => {
    chart.option = _.merge(chart.option, newVal);
    console.log("🚀 ~ chart.option:", chart.option)
  },
  { deep: true }
);
</script>

<template>
  <div ref="chartRef" class="chart">
    <slot />
  </div>
</template>

<style lang="css" scoped>
.chart {
  width: 100%;
  height: 100%;
  min-height: 50px;
}
</style>
