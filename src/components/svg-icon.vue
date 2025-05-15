<template>
  <svg
    class="svg-icon"
    :class="$attrs.class"
    :style="{
      width,
      height,
      fontSize: size,
      fill: color,
      ...$attrs.style
    }"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String]
    },
    color: {
      type: String,
      default: 'transparent'
    },
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    }
  },
  computed: {
    symbolId() {
      const prefix = this.$config?.svgSprite?.prefix || 'icon';
      return `#${prefix}-${this.name}`;
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  /* fill: currentColor; */
  overflow: hidden;
}
</style>

<!-- 02 -->
<!-- <template>
  <svg class="icon" :style="{ width: size, height: size }">
    <use :xlink:href="`#${prefix}-${name}`" />
  </svg>
</template>

<script>
export default {
  props: ['name', 'size'],
  computed: {
    prefix() {
      return this.$config?.svgSprite?.prefix || 'icon'
    }
  }
}
</script> -->


<!-- 03 -->
<!-- <template> -->
  <!-- <svg class="svg-icon" :style="{
    fontSize: size + 'px',
    width: width + 'px',
    height: height + 'px',
    color: color
  }">
    <use :xlink:href="iconName"></use>
  </svg> -->
  <!-- <svg class="svg-icon" :style="svgStyle">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'svgIcon',
  props: {
    name: {
      //svg图标名称
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#fff'
    },
    size: {
      //svg尺寸
      type: [Number, String]
    },
    width: {
      //svg宽度
      type: [Number, String]
    },
    height: {
      //svg高度
      type: [Number, String]
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`
    },
    svgStyle() {
      const width = typeof this.width === 'number' ? `${this.width}px` : this.width;
      const height = typeof this.height === 'number' ? `${this.height}px` : this.height;
      const size = typeof this.size === 'number' ? `${this.size}px` : this.size;
      return {
        fontSize: size,
        width,
        height,
        fill: this.color

      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style> -->
