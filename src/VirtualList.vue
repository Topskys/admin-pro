<template>
  <div ref="container" class="list-container" @scroll="handleScroll">
    <div ref="scrollContainer" class="scroll-container" :style="{ height: `${containerHeight}px`, overflowY: 'auto' }">
      <div
        v-for="(item, index) in displayedItems"
        :key="index"
        :style="{ height: `${itemHeight}px` }"
        class="list-item"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';

const props = defineProps<{
  items: string[];
  itemHeight: number;
}>();

const container = ref<HTMLDivElement | null>(null);
const scrollContainer = ref<HTMLDivElement | null>(null);
const containerHeight = ref(0);
const displayedItems = ref<string[]>([]);

const handleScroll = () => {
  if (!scrollContainer.value || !container.value) return;

  const scrollTop = scrollContainer.value.scrollTop;
  const startIdx = Math.floor(scrollTop / props.itemHeight);
  const endIdx = startIdx + Math.ceil(containerHeight.value / props.itemHeight);

  displayedItems.value = props.items.slice(startIdx, endIdx);
};

onMounted(() => {
  if (container.value) {
    containerHeight.value = container.value.clientHeight;
    handleScroll(); // 初始渲染可见项
  }
});
</script>

<style scoped>
.list-container {
  width: 500px;

  /* height: 100vh; */
  background-color: aquamarine;
}

.scroll-container {
  position: relative;
}

.list-item {
  display: flex;
  align-items: center;
}
</style>
