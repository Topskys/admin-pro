import { lazyReportBatch } from '../report';

export const originalProto = XMLHttpRequest.prototype;
export const originalOpen = originalProto.open;
export const originalSend = originalProto.send;

export default function xhr() {
  overwriteOpenAndSend();
}

function overwriteOpenAndSend() {
  originalProto.open = function newOpen(...args) {
    this.method = args[0];
    this.url = args[1];
    return originalOpen.apply(this, args);
  };
  originalProto.send = function newSend(...args) {
    this.startTime = Date.now();
    const onLoaded = () => {
      this.endTime = Date.now();
      this.duration = this.endTime - this.startTime;
      const { url, method, startTime, endTime, duration, status } = this;
      const reportData = {
        status,
        duration,
        endTime,
        startTime,
        url,
        method: method.toUpperCase(),
        type: 'performance',
        success: status >= 200 && status < 300,
        subType: 'xhr'
      };
      // TODO: 上报
      lazyReportBatch(reportData);
      this.removeEventListener('loadend', onLoaded, true);
    };
    // 监听xhr请求完成后触发onLoaded
    this.addEventListener('loadend', onLoaded, true);
    originalSend.apply(this, args);
  };
}
