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

   const  getCount=() =>{
      return result.value.count;
    }

    return {
      result,
      add,
      getCount
    };
  },
  {
    persist: true
  }
);
