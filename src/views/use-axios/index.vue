<script setup lang="ts">
import { useAxios } from '@/hooks/useAxiosVue';

const {
  request,
  loading,
  data,
  error,
  progress,
  cancel
} = useAxios(
  {
    baseURL: '/api',
    timeout: 10000
  },
  {
    concurrency: 3,
    debounce: 300,
    defaultRetry: 2,
    interceptors: {
      request: [
        config => {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
          return config;
        }
      ],
      response: [
        response => {
          if (response.data.code !== 0) {
            throw new Error(response.data.message);
          }
          return response;
        }
      ]
    }
  }
);

const fetchData = async () => {
  try {
    const result = await request({
      url: '/data',
      cacheKey: 'main-data',
      retry: 3,
      progress: percent => console.log(`Progress: ${percent}%`)
    });
    console.log('Data:', result);
  } catch (err) {
    console.error('Error:', err);
  }
};

fetchData();
</script>

<template>
  <div>
    <button @click="fetchData">Load Data</button>
    <button @click="cancel">Cancel</button>

    <div v-if="loading">
      Loading... {{ progress }}%
      <progress :value="progress" max="100" />
    </div>

    <div v-if="error" class="error">
      Error: {{ error.message }}
    </div>

    <pre v-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>