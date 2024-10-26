import { ref } from 'vue';

// 公共的组件实例类型
export function useCompRef<T extends abstract new (...args: any) => any>() {
  return ref<InstanceType<T>>();
}
