import pinia from '..';
import { defineStore } from 'pinia';

export const useSettingStoreHook = defineStore('setting', {
  state: () => ({
    title: [] as string[],
    // 是否显示侧边栏
    isCollapse: false,
    // 是否显示标签栏
    isTagsView: true,
    // 是否显示面包屑
    isBreadcrumb: true,
    // 是否显示logo
    isLogo: true,
    // 是否显示全屏
    isFullScreen: false
  }),
  actions: {
    setTitle(title: string[]) {
      this.title = title;
    },
    setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    setTagsView() {
      this.isTagsView = !this.isTagsView;
    },
    setBreadcrumb() {
      this.isBreadcrumb = !this.isBreadcrumb;
    }
  }
});

export function useSettingStore() {
  return useSettingStoreHook(pinia);
}
