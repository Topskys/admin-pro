<template>
  <div ref="list" class="container" @scroll="handleScroll">
    <div class="list-all" :style="{ height: `${listHeight}px` }"></div>
    <div class="list-view" :style="{ transform: getTransform }">
      <div
        v-for="item in viewData"
        :key="item.id"
        ref="items"
        class="list-item"
        :style="{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';

const props = defineProps({
  itemHeight: {
    type: Number,
    default: 50
  },
  listData: {
    type: Array<any>,
    default: () => []
  }
});

const list = ref<HTMLDivElement | null>(null);
const items = ref<HTMLDivElement | null>(null);
const screenHeight = ref(0); // 实际可用的屏幕高度
const scrollTop = ref(0); // 当前的滚动位置
const startIndex = ref(0); // 可见数据的开始索引
const endIndex = ref(0); // 可见数据的结束索引
const startOffset = ref(0); // 实际偏移量

// 列表高度
const listHeight = computed(() => {
  return props.listData.length * props.itemHeight;
});
// 可见数据条数
const visibleItemCount = computed(() => {
  return Math.ceil(screenHeight.value / props.itemHeight);
});
// 列表偏移量
const getTransform = computed(() => {
  return `translate3d(0, ${startOffset.value}px, 0)`;
});
// 可见数据
const viewData = computed(() => {
  return props.listData.slice(startIndex.value, Math.min(endIndex.value, props.listData.length));
});

// 初始化
onMounted(() => {
  console.log('listHeight', list.value?.clientHeight);
  screenHeight.value = list.value!.clientHeight;
  endIndex.value = startIndex.value + visibleItemCount.value;
});

// 滚动事件
const handleScroll = () => {
  // 当前滚动位置
  scrollTop.value = list.value!.scrollTop;
  // 此时的开始索引和结束索引
  startIndex.value = Math.floor(scrollTop.value / props.itemHeight);
  endIndex.value = startIndex.value + visibleItemCount.value;
  // 此时的偏移量
  startOffset.value = scrollTop.value - (scrollTop.value % props.itemHeight);
};
</script>

<style scoped>
.container {
  position: relative;
  overflow: auto;
  height: 100vh;

  /* 优化滚动 */
  -webkit-overflow-scrolling: touch;
}

.list-view {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  text-align: center;
  background-color: antiquewhite;
}

.list-item {
  margin-bottom: 5px;
  background-color: azure;
}
</style>
