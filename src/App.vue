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
</ParentComponent>
<div class="border"></div> -->
  <!-- <VirtualList :list-data="items" :item-height="50" /> -->
  <div><button @click="jsErr">測試monitor捕獲vue框架錯誤</button></div>
</template>

<script setup lang="ts">
// import VirtualList from './features/VirtualList.vue';
// const items = ref(
//   Array.from({ length: 10000000 }, (_, i) => {
//     return {
//       id: i,
//       value: `Item ${i}`
//     };
//   })
// );
// import './features';
// import ParentComponent from './features/parentComponent';

const jsErr = () => {
  const num = new Number(223.12);
  throw new Error('js error');
  // console.log(num.toFixed(01));
};
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
