<template>
  <!-- <ParentComponent>
    <p>default slot 默认插槽1</p>
    <p>default slot 默认插槽2</p>
    <template #slot1>
      <p>detail name slot 具名插槽</p>
    </template>
<template #slot2="props">
      <p>scope slot 作用域插槽-{{ props }}</p>
    </template>
</ParentComponent> -->
  <!-- <div class="list-container" ref="container" @scroll="handleScroll">  
    <div class="scroll-container" ref="scrollContainer" :style="{ height: `${containerHeight}px`, overflowY: 'auto' }">  
      <div   
        v-for="(item, index) in displayedItems"   
        :key="index"  
        :style="{ height: `${itemHeight}px` }"  
        class="list-item"  
      >  
        {{ item }}  
      </div>  
    </div>   -->
  <div class="border"></div>
  <VirtualList :items="items" :item-height="50" />
</template>

<script setup lang="ts">
// import ParentComponent from './parentComponent.js';
// import { VirtualList } from './virtualList.js';
import VirtualList from './VirtualList.vue';
const items = ref(Array.from({ length: 10000 }, (_, i) => `Item ${i}`));

onMounted(() => {
  // 使用示例
  // const container = document.getElementById('list-container');
  // const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);
  // const virtualList = new VirtualList(container, items, 50); // 假设每个列表项高度为50px
});
</script>
<style lang="less">
#app {
  height: inherit;
}

.border {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 50px;
  border-color: transparent transparent #d9534f;
}
</style>
