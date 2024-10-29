import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    title: ''
  }),
  actions: {
    setTitle(title: string) {
      this.title = title;
    }
  }
});
