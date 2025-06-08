<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string;
    width?: number | string;
    height?: number | string;
  }>(),
  {
    name: 'icon-default',
    width: '1em',
    height: '1em'
  }
);

function getImgUrl(name: string, prefix: string = 'svg') {
  const hasExtension = String(name)?.trim()?.includes('.');
  const fileName = hasExtension ? name : `${name}.${prefix}`;
  return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
}

function getImgUrlByGlob(name: string, prefix: string = 'svg') {
  const path = `/src/assets/icons/${name}.${prefix}`;
  const modules = import.meta.glob('../icons/*.svg', { eager: true });
  return modules[path]?.default;
}

const imgUrl = computed(() => getImgUrl(props.name));
</script>
w
<template>
  <img :src="imgUrl" alt="" class="img-icon" />
</template>

<style lang="css" scoped>
.img-icon {
  width: 1em;
  height: 1em;
  /* vertical-align: middle; */
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
