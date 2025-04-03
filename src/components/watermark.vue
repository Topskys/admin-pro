<script setup lang="ts">
import { onMounted, watch } from 'vue';
const props = withDefaults(
  defineProps<{
    text: string;
    config: {
      text: string;
      size: number;
      fontSize: number;
      fill: string;
      gap: number;
      rotate: number;
      textAlign: 'left' | 'center' | 'right';
      textBaseline: 'top' | 'middle' | 'bottom';
    };
  }>(),
  {
    text: 'Watermark',
    config: () => ({
      text: 'Watermark',
      size: 100,
      fontSize: 16,
      fill: 'rgba(0, 0, 0, 0.8)',
      gap: 20,
      rotate: -45,
      textAlign: 'center',
      textBaseline: 'middle'
    })
  }
);

const config = props.config;

const watermarkRef = ref<HTMLDivElement | null>(null);

const watermark = computed(() => {
  // 创建一个canvas元素，并获取其2d上下文对象
  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext('2d')!;

  // 计算文字宽度，并设置画布大小
  const { width } = ctx.measureText(props.text);
  const canvasSize = Math.max(config.size, width) + config.gap * dpr;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  // 将画布的原点移动到中心位置
  ctx.translate(canvas.width / 2, canvas.height / 2);
  // 将画布的原点旋转
  ctx.rotate((Math.PI / 180) * config.rotate);
  // 设置水印字体样式
  const fontSize = config.fontSize * dpr;
  ctx.font = `${fontSize}px serif`;
  ctx.fillStyle = config.fill;
  ctx.textAlign = config.textAlign;
  ctx.textBaseline = config.textBaseline;
  ctx.fillText(props.text, 0, 0); // 水印文字内容，x坐标为50，y坐标为50

  return {
    base64: canvas.toDataURL(),
    size: canvasSize / dpr,
    styleSize: canvasSize / dpr
  };
});

let div;

function resetWatermark() {
  if (!watermarkRef.value) {
    return;
  }
  if (div) {
    div.remove();
  }
  const { base64, size } = watermark.value;
  div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.backgroundImage = `url(${base64})`;
  div.style.backgroundSize = `${size}px ${size}px`;
  div.style.backgroundRepeat = 'repeat';
  div.style.pointerEvents = 'none';
  div.style.zIndex = 999;
  div.style.inset = '0px';

  watermarkRef.value.appendChild(div);
}

const observer = new MutationObserver((entries) => {
  for (const entry of entries) {
    // 处理被删除的情况
    for (const node of Object.entries(entry.removedNodes)) {
      if (node === div) {
        resetWatermark();
        return;
      }
    }
    // 处理被修改的情况
    if (entry.target === div) {
      resetWatermark();
    }
  }
});

onMounted(() => {
  resetWatermark();
  observer.observe(watermarkRef.value!, {
    childList: true,
    attributes: true,
    subtree: true
  });
});

onUnmounted(() => {
  observer?.disconnect();
  div = null;
});

watch(
  config,
  () => {
    resetWatermark();
  },
  { deep: true }
);
</script>

<template>
  <div ref="watermarkRef" class="watermark">
    <slot></slot>
  </div>
</template>

<style scoped>
.watermark {
  position: relative;
}
</style>
