import * as _ from 'lodash-es';
import { ResizeOpts, SetOptionOpts } from 'echarts';
import echarts, { ECOption } from '@/plugins/echarts';

export type Options = {
  theme?: string;
  option?: ECOption;
  observed?: boolean;
};

// type UseChart = (
//   el: Ref<HTMLElement>,
//   options: Options
// ) => {
//   initChart: () => void;
//   updateChart: (config: SetOptionOpts) => void;
//   resize: () => void;
//   observeChart: () => void;
//   unobserveChart: () => void;
//   chartInstance: Ref<echarts.ECharts | null>;
// };

export function useChart(el: Ref<HTMLElement | null>, options?: Options) {
  const defaultOption = {};
  const mergedOption = _.merge(defaultOption, options?.option);
  const option = reactive<ECOption>(mergedOption);
  const chartInstance = ref<echarts.ECharts | null>(null);
  const mutationObserver = ref<MutationObserver | null>(null);
  const resizeObserver = ref<ResizeObserver | null>(null);

  /**
   * 初始化图表
   */
  const initChart = () => {
    const dom = el.value;
    if (!dom || chartInstance.value) {
      return;
    }
    chartInstance.value = echarts.init(dom, options?.theme);
  };

  /**
   * 更新图表配置
   *
   * @param config 图表配置选项
   */
  const updateChart = (config?: SetOptionOpts) => {
    nextTick(() => {
      if (!chartInstance.value) {
        initChart();
        if (!chartInstance.value) {
          return;
        }
      }
      const defaultConfig = {
        lazyUpdate: true
      } as SetOptionOpts;
      const mergedConfig = _.merge(defaultConfig, config) as SetOptionOpts;
      chartInstance.value.setOption(option, mergedConfig);
    });
  };

  /**
   * 调整图表大小
   *
   * 此函数用于调整图表的大小。如果 chartInstance 存在且已初始化，则会调用其 resize 方法。
   */
  const resize = (config?:ResizeOpts) => {
    const defaultConfig = {
      animation: {
        duration: 300
      }
    } as ResizeOpts;
    const mergedConfig = _.merge(defaultConfig, config) as ResizeOpts;
    chartInstance.value?.resize(mergedConfig);
    console.log('🚀 ~ resize ~ resize:');
  };

  const debounceResize = _.debounce(resize, 300);

  /**
   * 观察图表变化
   *
   * 使用 MutationObserver 监听图表元素的变化，并在变化时重新调整图表大小
   */
  const observeChart = () => {
    // if (!options?.observed || !el.value) {
    //   return;
    // }

    nextTick(() => {
      resizeObserver.value = new ResizeObserver(() => debounceResize());
      resizeObserver.value?.observe(el.value!);

      //   mutationObserver.value = new MutationObserver(() => resize());
      //   mutationObserver.value?.observe(el.value!, {
      //     childList: true,
      //     subtree: true,
      //     attributes: true
      //   });
    });
  };

  /**
   * 停止观察图表的变化。
   *
   * 调用此函数将断开当前图表变化观察者（MutationObserver）的连接，并将其值设置为null。
   */
  const unobserveChart = () => {
    resizeObserver.value?.disconnect();
    mutationObserver.value?.disconnect();
    resizeObserver.value = null;
    mutationObserver.value = null;
  };

  /**
   * 销毁图表实例并清空引用
   */
  const disposeChart = () => {
    chartInstance.value?.dispose();
    chartInstance.value = null;
  };

  onMounted(() => {
    initChart();
    observeChart();
    updateChart();
    // window.onresize = debounceResize;
  });

  onUnmounted(() => {
    disposeChart();
    unobserveChart();
    window.onresize = null;
  });

  watch(
    () => option,
    () => updateChart(),
    {
      deep: true
    }
  );

  watch(
    () => el.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        disposeChart();
        initChart();
        updateChart();
      }
    }
  );

  return {
    option,
    chartInstance,
    initChart,
    updateChart,
    observeChart,
    unobserveChart,
    resize
  };
}
