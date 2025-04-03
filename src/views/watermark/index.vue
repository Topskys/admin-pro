<template>
  <div class="container">
    <el-form v-model="config" size="" label-position="top" style="width: 350px">
      <el-form-item label="图片上传">
        <el-upload
          drag
          action=""
          :auto-upload="false"
          :show-file-list="false"
          style="width: 100%"
          @change="handleImageUpload"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽图片到此或 <em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="水印文字">
        <el-input v-model="config.text" placeholder="输入水印内容" />
      </el-form-item>
      <div style="display: flex; justify-content: space-between">
        <el-form-item label="字体大小">
          <el-input-number v-model="config.fontSize" :min="12" :max="48" :step="1" />
        </el-form-item>
        <el-form-item label="文字颜色">
          <el-color-picker v-model="config.fill" />
        </el-form-item>
      </div>
      <el-form-item label="水平对齐">
        <el-select v-model="config.textAlign" placeholder="请选择">
          <el-option v-for="item in alignOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="垂直对齐">
        <el-select v-model="config.textBaseline" placeholder="请选择">
          <el-option v-for="item in baselineOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <div style="display: flex; justify-content: space-between">
        <el-form-item label="水印尺寸">
          <el-input-number v-model="config.size" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="旋转角度">
          <el-input-number v-model="config.rotate" :min="-360" :max="360" :step="1" />
        </el-form-item>
      </div>
      <el-form-item label="水印插槽样式">
        <el-input v-model="watermarkStyle" :rows="3" type="textarea" placeholder="Please input..." />
      </el-form-item>
    </el-form>
    <div class="preview-wrapper">
      <watermark :text="config.text" :config="config" :style="watermarkStyle">
        <img :src="imageSrc" alt="请先上传需要添加水印的图片" class="preview-img" />
      </watermark>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import watermark from '@/components/watermark.vue';

const imageSrc = ref<any>('/20250331221126.png');

const config = reactive<{
  text: string;
  size: number;
  fontSize: number;
  fill: string;
  gap: number;
  rotate: number;
  textAlign: 'left' | 'center' | 'right';
  textBaseline: 'top' | 'middle' | 'bottom';
}>({
  text: 'Watermark',
  fontSize: 16,
  fill: 'rgba(0, 0, 0, 0.8)',
  gap: 20,
  rotate: -45,
  size: 50,
  textAlign: 'center',
  textBaseline: 'middle'
});

const watermarkStyle = ref('width: fit-content;height: fit-content;user-select:none;');

const alignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中对齐', value: 'center' },
  { label: '右对齐', value: 'right' }
];

const baselineOptions = [
  { label: '顶部对齐', value: 'top' },
  { label: '中部对齐', value: 'middle' },
  { label: '底部对齐', value: 'bottom' }
];

// 处理图片上传
const handleImageUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    imageSrc.value = e.target!.result;
  };
  reader.readAsDataURL(file.raw);
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow: auto;
  display: flex;
  gap: 20px;
  margin-top: -15px;

  .preview-img {
    max-width: 100%;
    max-height: 100%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .preview-wrapper {
    padding: 18px;
    margin: 0 18px;
    background: #f5f7fa;
    border-radius: 6px;
    flex: 1 1 10px;
    overflow: auto;
    display: flex;
    justify-content: center;
    min-width: 500px;
  }

  :deep(.el-color-picker) {
    .el-color-picker__trigger {
      width: 150px;
    }

    .el-color-picker__color-inner {
      justify-content: end;
    }

    .el-color-picker__icon {
      margin-right: 5px;
    }
  }
}
</style>
