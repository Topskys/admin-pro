/**
 * 写一个倒计时功能的hooks，要求如下：
 * 输入：‘00:00:00’格式
 * 输出：‘00:00:00’格式
 * 输出包含当前剩余时间和已使用时间
 *
 */
import { ref, computed, onUnmounted, type Ref } from 'vue';

interface CountdownResult {
  remaining: Ref<string>;
  used: Ref<string>;
  pause: () => void;
  resume: () => void;
  reset: (newTime: string) => void;
}

/**
 * 倒计时钩子函数
 *
 * @param initialTime 初始时间，格式为 "HH:MM:SS"
 * @param onEnd 倒计时结束时触发的回调函数，可选
 * @returns 返回一个包含倒计时剩余时间、已用时间、暂停、继续和重置功能的对象
 */
export function useCountdown(initialTime: string, onEnd?: () => void): CountdownResult {
  // 转换时间字符串为秒数
  const parseTime = (timeStr: string): number => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // 格式化秒数为时间字符串
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  let initialSeconds = parseTime(initialTime);
  const remainingSeconds = ref(initialSeconds);
  const isActive = ref(false);
  let timer: NodeJS.Timeout | null = null;

  const remaining = computed(() => formatTime(remainingSeconds.value));
  const used = computed(() => formatTime(initialSeconds - remainingSeconds.value));

  const start = () => {
    if (!isActive.value && remainingSeconds.value > 0) {
      isActive.value = true;
      timer = setInterval(() => {
        if (remainingSeconds.value > 0) {
          remainingSeconds.value--;
        } else {
          clearTimer();
          onEnd?.();
        }
      }, 1000);
    }
  };

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      isActive.value = false;
    }
  };

  const pause = () => {
    clearTimer();
  };

  const resume = () => {
    start();
  };

  const reset = (newTime: string) => {
    clearTimer();
    const newSeconds = parseTime(newTime);
    initialSeconds = newSeconds;
    remainingSeconds.value = newSeconds;
    start();
  };

  // 自动开始倒计时
  start();

  // 组件卸载时清除定时器
  onUnmounted(clearTimer);

  return { remaining, used, start, pause, resume, reset };
}
