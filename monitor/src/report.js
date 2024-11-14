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
 * 批量上報數據
 * @param {any} data 上報的數據
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
 * 使用圖片請求發送數據
 * @param {string} url 上報地址
 * @param {any} data 上報的數據
 */
export function imgRequest(data) {
  const img = new Image();
  // 發送數據
  img.src = `${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`;
}

/**
 * 普通ajax發送請求數據
 * @param {any} data
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
 * 判斷瀏覽器是否支持sendBeacon
 * @returns boolean
 */
export function isSupportSendBeacon() {
  return 'sendBeacon' in navigator;
}

// const sendBeacon = isSupportSendBeacon() ? navigator.sendBeacon : xhrRequest;

/**
 * 使用sendBeacon發送上報數據
 * @param {any} data 上報數據
 */
export function sendBeaconRequest(data) {
  let flag = true;
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
