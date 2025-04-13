<template>
  <div class="preview-wrapper">
    <video :src="videoUrl" class="preview-video" ref='videoRef' controls></video>
    <el-upload action="" :auto-upload="false" :show-file-list="false" class="upload" @change="handleImageUpload">
      <div class="el-upload__text">打开文件</div>
    </el-upload>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue';

const videoUrl = ref<any>('');
const videoRef = ref<HTMLVideoElement | null>(null);  // 添加视频引用

// 处理图片上传
const handleImageUpload = (file) => {
  // 添加文件类型验证
  if (!file.raw.type.startsWith('video/')) {
    return alert('请选择视频文件');
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    videoRef.value?.pause();
    videoUrl.value = e.target!.result;
    // 添加播放控制
    // nextTick(() => {
    //   videoRef.value?.play().catch(error => {
    //     console.error('自动播放失败:', error);
    //   });
    // });
  };

  reader.readAsDataURL(file.raw);
};
</script>

<style lang="less" scoped>
.preview-wrapper {
  padding: 18px;
  background: #000;
  border-radius: 6px;
  flex: 1 1 10px;
  overflow: auto;
  display: flex;
  justify-content: center;
  min-width: 500px;
  height: 100%;
  margin-top: -15px;
  overflow: auto;
  position: relative;

  .preview-video {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .upload {
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    z-index: 2;
  }

  &:hover .upload {
    display: block;
    position: absolute;
    left: 40px;
    bottom: 50px;
    transform: translate(0, 0);
  }
}
</style>
