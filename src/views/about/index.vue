<template>
  <div class="container">
    <Tag text="CustomTag" theme="blue"></Tag>
    <Tag text="测试自定义组件" theme="blue"></Tag>
    <div class="images-box">
      <img v-for="(v, i) in images" :key="v" :src="v" :alt="i + ''" width="200px" height="300px" anonymous />
    </div>
  </div>
</template>
<script setup lang="ts">
import preloadImages from '@/utils/preload-image';

// 构建工具自动注册组件
// import CustomTag from '@/components/Tag.vue';
const images = ref<string[]>([
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/Y9M00uVO0Qt0qDv28eAN.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg',
  'https://apicdn.likepoems.com/images/mc/uj4N3DwIm2tdo1hhiy54.jpg'
]);

const fetchImageUrls = async (count = 50) => {
  const obj = {};
  for (let i = 0; i < count; i++) {
    const res = await fetch(`/pic/img/mc/?json`);
    const response = await res.json();
    if ((response.code = 200)) {
      obj[i] = response.url; // 获取图片的 URL
      images.value.push(response.url); // 获取图片的 URL
    } else {
      console.error('Failed to fetch image:', response.status);
    }
  }
  console.log(images.value);
};

onMounted(async () => {
  // await fetchImageUrls(50);
  preloadImages(images.value, { max: 6 });
});
</script>
<style lang="less" scoped>
.images-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
</style>
