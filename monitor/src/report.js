import config from './config';
import { addCache, clearCache, getCache } from './cache';
import { generateUniqueId } from './utils';

export const originalProto = XMLHttpRequest.prototype;
export const originalOpen = originalProto.open;
export const originalSend = originalProto.send;

/**
 * 上報數據
 * @param {any} data 上報的數據
 */
export function report(data) {
  if (!config.url) {
    console.error('请配置上报 url 地址');
  }
  const reportData = JSON.stringify({
    id: generateUniqueId(),
    data
  });
  if (!config?.isImageUpload) {
    // 優先使用sendBeacon上報數據
    if (window.navigator?.sendBeacon) {
      return sendBeaconRequest(reportData);
    }
    return xhrRequest(reportData);
  }
  return imgRequest(reportData);
}

/**
 * 延迟批量上报数据
 *
 * @param {any} data - 待上报的数据数组
 */
export function lazyReportBatch(data) {
  addCache(data);
  const cacheData = getCache();
  console.error('cacheData', cacheData);
  if (cacheData.length && cacheData.length >= config.batchSize) {
    report(cacheData);
    clearCache();
  }
}

/**
 * 使用图片形式上报数据，避免跨域限制问题。
 *
 * @param {any} data - 要上报的数据对象
 */
export function imgRequest(data) {
  const img = new Image();
  // 發送數據
  img.src = `${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`;
}

/**
 * 使用XHR上报数据
 *
 * @param {any} data - 待上报的数据对象
 */
export function xhrRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        const xhr = new XMLHttpRequest();
        originalOpen.call(xhr, 'POST', config.url);
        originalSend.call(xhr, JSON.stringify(data));
      },
      {
        timeout: 3000
      }
    );
  } else {
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      originalOpen.call(xhr, 'POST', config.url);
      originalSend.call(xhr, JSON.stringify(data));
    });
  }
}

/**
 * 判断浏览器是否支持 sendBeacon 方法
 *
 * @returns {boolean} 如果浏览器支持 sendBeacon 方法则返回 true，否则返回 false
 */
export function isSupportSendBeacon() {
  return 'sendBeacon' in navigator;
}

// const sendBeacon = isSupportSendBeacon() ? navigator.sendBeacon : xhrRequest;

/**
 * 使用navigator.sendBeacon方法发送Beacon请求上报
 *
 * @param {any} data - 待上报的数据对象
 */
export function sendBeaconRequest(data) {
  // 如果瀏覽器空閒時間大於3s會發送上報數據
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        window.navigator.sendBeacon(config.url, data);
      },
      {
        timeout: 3000
      }
    );
  } else {
    setTimeout(() => {
      window.navigator.sendBeacon(config.url, data);
    });
  }
}
