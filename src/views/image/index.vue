<script setup>
import { ref } from 'vue';
import sharp from 'sharp';

// 响应式状态
const compressedImage = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');
const previewImage = ref(null);
const quality = ref(80);
const selectedFormat = ref('webp');
const formatOptions = ref([
  { value: 'webp', label: 'WebP' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' }
]);

// 获取格式配置参数
const getFormatConfig = () => {
  switch (selectedFormat.value) {
    case 'webp':
      return { quality: quality.value, lossless: false };
    case 'jpeg':
      return { quality: quality.value, mozjpeg: true };
    case 'png':
      return { compressionLevel: 9, quality: quality.value };
    default:
      return {};
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 文件校验
  if (!file.type.startsWith('image/')) {
    errorMessage.value = '请选择图片文件';
    return;
  }
  if (file.size > 50 * 1024 * 1024) {
    errorMessage.value = '文件大小不能超过50MB';
    return;
  }

  try {
    isLoading.value = true;
    const buffer = await file.arrayBuffer();
    previewImage.value = URL.createObjectURL(file);

    // 图片处理流程
    compressedImage.value = await sharp(buffer)
      //   .resize({ width: 1920, withoutEnlargement: true })
      .toFormat(selectedFormat.value, getFormatConfig())
      .toBuffer();
  } catch (error) {
    errorMessage.value = `处理失败: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

const downloadCompressedImage = () => {
  if (!compressedImage.value) return;

  const mimeTypeMap = {
    webp: 'image/webp',
    jpeg: 'image/jpeg',
    png: 'image/png'
  };

  const blob = new Blob([compressedImage.value], {
    type: mimeTypeMap[selectedFormat.value]
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `compressed.${selectedFormat.value}`;
  link.click();
  URL.revokeObjectURL(link.href);
};
</script>

<template>
  <div class="image-compressor">
    <div class="controls">
      <div class="param-group">
        <label>输出格式：</label>
        <select v-model="selectedFormat">
          <option v-for="format in formatOptions" :key="format.value" :value="format.value">
            {{ format.label }}
          </option>
        </select>
      </div>

      <div class="param-group">
        <label>压缩质量：{{ quality }}%</label>
        <input v-model="quality" type="range" min="1" max="100" />
      </div>
    </div>

    <div class="upload-section">
      <input type="file" accept="image/*" class="file-input" @change="handleFileUpload" />
      <div v-if="previewImage" class="preview-container">
        <img :src="previewImage" alt="原始图片预览" class="preview-image" />
      </div>
    </div>

    <div class="status-info">
      <div v-if="isLoading" class="progress-bar">处理中...</div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>

    <button :disabled="!compressedImage || isLoading" class="download-btn" @click="downloadCompressedImage">
      ⬇️ 下载 {{ selectedFormat.toUpperCase() }} 格式 ({{ (compressedImage?.byteLength / 1024).toFixed(1) }}KB)
    </button>
  </div>
</template>

<style scoped>
.controls {
  margin-bottom: 1.5rem;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.param-group {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.param-group label {
  min-width: 100px;
  font-weight: 500;
}

select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input[type='range'] {
  flex: 1;
  max-width: 200px;
}

/* 保持原有样式不变 */
.image-compressor {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
}

.file-input {
  display: block;
  margin: 1rem 0;
  padding: 0.5rem;
}

.preview-container {
  margin: 1rem 0;
  border: 2px dashed #ddd;
  padding: 10px;
}

.preview-image {
  max-width: 100%;
  height: auto;
  max-height: 300px;
}

.download-btn {
  background: #4caf50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.download-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.progress-bar {
  padding: 8px;
  background: #f3f3f3;
  margin: 1rem 0;
}

.error-message {
  color: #ff4444;
  padding: 8px;
  border: 1px solid #ff4444;
  margin: 1rem 0;
}
</style>
