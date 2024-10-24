import { ElMessage, MessageHandler } from 'element-plus';

interface MessageOptions {
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  center?: boolean;
  duration?: number;
  showClose?: boolean;
}

let prevType = '';
let prevInstance: MessageHandler | null = null;
/**
 * 消息提示（单例模式）
 *
 * @param option 消息配置
 * @returns void
 */
export function showMessage(option: MessageOptions) {
  const { type = '' } = option;
  // 判断弹窗的类型是不是一致，一致就不弹出
  if (prevInstance && type === prevType) {
    return;
  }
  prevType = type;
  if (prevInstance) prevInstance.close();

  prevInstance = ElMessage({
    ...option,
    onClose: () => {
      prevType = '';
      prevInstance = null;
    }
  });
}

export default showMessage;
