<template>
  <div class="custom-tag">
    <span v-bind="props" ref="tagRef" class="tag"></span>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
const props = defineProps({
  text: {
    type: String,
    default: null,
    require: false
  },
  theme: {
    type: String,
    default: null,
    require: false
  }
});

const tagRef = ref<HTMLElement>();

const setText = () => {
  tagRef.value!.innerHTML = props.text;
};
const setTheme = () => {
  tagRef.value!.style.backgroundColor = props.theme;
};

onMounted(() => {
  setText();
  setTheme();
});
</script>
<style lang="less" scoped>
.tag {
  color: white;
  background-color: blueviolet;
}
</style>
