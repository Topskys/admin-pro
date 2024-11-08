<template>
  <ParentComponent>
    <p>default slot 默认插槽1</p>
    <p>default slot 默认插槽2</p>
    <template #slot1>
      <p>detail name slot 具名插槽</p>
    </template>
    <template #slot2="props">
      <p>scope slot 作用域插槽-{{ props }}</p>
    </template>
  </ParentComponent>
  <div class="border"></div>
  <VirtualList :items="items" :item-height="50" />
</template>

<script setup lang="ts">
import VirtualList from './VirtualList.vue';
const items = ref(Array.from({ length: 10000 }, (_, i) => `Item ${i}`));
import './features';
import ParentComponent from './features/parentComponent';
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
