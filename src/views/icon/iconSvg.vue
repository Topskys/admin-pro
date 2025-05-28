<!-- <script setup>
import { defineProps, computed } from 'vue';

// 使用 import.meta.glob 导入所有 SVG 图标
const svgModules = import.meta.glob('@/icons/*.svg', { as: 'raw', eager: true });

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  size: {
    type: [String, Number],
    default: 24
  },
  hoverEffect: {
    type: String,
    default: 'none' // 可选值: 'none', 'scale', 'rotate', 'color-change'
  }
});

// 根据图标名称获取 SVG 内容
const svgContent = computed(() => {
  // 构建路径：注意路径与 import.meta.glob 中使用的模式匹配
  const path = `/src/assets/icons/${props.name}.svg`;

  // 查找匹配的模块
  for (const [key, value] of Object.entries(svgModules)) {
    if (key.includes(props.name)) {
      return value;
    }
  }

  // 如果找不到图标，返回默认图标或空字符串
  return '';
});

// 计算样式
const iconStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size;
  return {
    width: size,
    height: size,
    fill: props.color,
    display: 'inline-block'
  };
});

// 悬停效果类
const hoverClass = computed(() => {
  if (props.hoverEffect === 'scale') return 'svg-icon-hover-scale';
  if (props.hoverEffect === 'rotate') return 'svg-icon-hover-rotate';
  if (props.hoverEffect === 'color-change') return 'svg-icon-hover-color';
  return '';
});
</script>

<template>
  <div class="svg-icon-container" :class="hoverClass" :style="iconStyle" v-html="svgContent"></div>
</template>

<style scoped>
.svg-icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.svg-icon-container :deep(svg) {
  width: 100%;
  height: 100%;
  fill: inherit;
}

.svg-icon-hover-scale:hover {
  transform: scale(1.2);
}

.svg-icon-hover-rotate:hover {
  transform: rotate(15deg);
}

.svg-icon-hover-color:hover {
  fill: #ffcc00 !important;
}
</style> -->



<!-- 优化 -->
<script setup>
import { defineProps, ref, watchEffect, computed } from 'vue';

// 动态导入 SVG（非 eager）
const svgModules = import.meta.glob('@/icons/*.svg', { as: 'raw' });

// 构建图标映射
const iconMap = new Map();
Object.keys(svgModules).forEach(path => {
  const name = path.split('/').pop().replace('.svg', '');
  iconMap.set(name, path);
});

// 图标缓存
const iconCache = new Map();

// 优化 SVG 内容
const optimizeSVG = (svg) => {
  return svg
    .replace(/<!--.*?-->/gs, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n/g, '')
    .replace(/fill="[^"]*"/g, '')
    .replace(/stroke="[^"]*"/g, '');
};

// 加载图标
const loadIcon = async (name) => {
  if (!iconMap.has(name)) return '';
  if (iconCache.has(name)) return iconCache.get(name);
  
  try {
    const path = iconMap.get(name);
    let content = await svgModules[path]();
    content = optimizeSVG(content);
    iconCache.set(name, content);
    return content;
  } catch (error) {
    console.error(`Failed to load icon: ${name}`, error);
    return '';
  }
};

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  size: {
    type: [String, Number],
    default: 24
  },
  hoverEffect: {
    type: String,
    default: 'none'
  }
});

const svgContent = ref('');
const isLoading = ref(false);
const error = ref(null);

watchEffect(async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    svgContent.value = await loadIcon(props.name);
  } catch (e) {
    error.value = e.message;
    svgContent.value = '';
  } finally {
    isLoading.value = false;
  }
});

const iconStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const hoverClass = computed(() => {
  if (props.hoverEffect === 'scale') return 'hover-scale';
  if (props.hoverEffect === 'rotate') return 'hover-rotate';
  if (props.hoverEffect === 'color-change') return 'hover-color';
  return '';
});
</script>

<template>
  <div class="svg-icon-wrapper">
    <div v-if="isLoading" class="loading-indicator">
      <div class="spinner"></div>
    </div>
    
    <div v-else-if="error" class="error-message">
      <span>⚠️</span> {{ error }}
    </div>
    
    <div 
      v-else
      class="svg-icon-container"
      :class="hoverClass"
      :style="iconStyle"
      v-html="svgContent"
    ></div>
  </div>
</template>

<style scoped>
.svg-icon-wrapper {
  position: relative;
  display: inline-flex;
}

.svg-icon-container {
  transition: all 0.3s ease;
}

.svg-icon-container :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: v-bind('iconStyle.width');
  height: v-bind('iconStyle.height');
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid currentColor;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #ff6b6b;
  font-size: 0.8em;
  display: flex;
  align-items: center;
  gap: 5px;
}

.hover-scale:hover {
  transform: scale(1.2);
}

.hover-rotate:hover {
  transform: rotate(15deg);
}

.hover-color:hover {
  color: #ffcc00 !important;
}
</style>