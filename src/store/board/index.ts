import { defineStore } from 'pinia';

export const useBoardStore = defineStore(
  'board',
  () => {
    const result = ref<{ count: number }>({
      count: 0
    });

    const add = () => {
      result.value.count++;
    };

    onMounted(() => {
      setInterval(() => {
        add();
      }, 10000);
    });

    return {
      result,
      add
    };
  },
  {
    persist: false
  }
);
