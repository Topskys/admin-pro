import { defineStore } from 'pinia';

export const useSettingStore = defineStore('setting', {
  state: () => ({
    count: 0
  }),
  actions: {
    addCount() {
      this.count++;
    }
  }
});
