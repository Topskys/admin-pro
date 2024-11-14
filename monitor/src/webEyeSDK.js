import behavior from './behavior/index';
import performance from './performance/index';
import error from './error/index';
import { setConfig } from './config';
import { lazyReportBatch } from './report';

/**
 * 錯誤上報插件
 * @module webEyeSDK
 * @description 錯誤上報插件，提供對Vue項目進行錯誤處理，對React項目進行錯誤處理
 */
window.__webEyeSDK__ = {
  version: '0.0.1'
};

/**
 * 針對Vue項目進行錯誤處理
 * @param {vue} Vue Vue實例
 * @param {object} options 配置項
 * @returns
 */
export function install(Vue, options) {
  if (__webEyeSDK__.vue) return;
  __webEyeSDK__.vue = true;
  setConfig(options);
  const handler = Vue.config.errorHandler;
  Vue.config.errorHandler = function (err, vm, info) {
    // 上報具體的錯誤信息
    const reportData = {
      info,
      error: err?.stack,
      subType: 'vue',
      type: 'error',
      startTime: window.performance.now(),
      pageUrl: window.location.href
    };
    lazyReportBatch(reportData);
    if (handler) {
      handler.call(this, err, vm, info);
    }
  };
}

/**
 * 針對React項目進行錯誤處理
 * @param {any} err
 * @param {any} info
 * @returns
 */
function errorBoundary(err, info) {
  if (__webEyeSDK__.react) return;
  __webEyeSDK__.react = true;
  // 上報具體的錯誤信息
  const reportData = {
    info,
    error: err?.stack,
    subType: 'react',
    type: 'error',
    startTime: window.performance.now(),
    pageUrl: window.location.href
  };
  lazyReportBatch(reportData);
}

/**
 * 初始化插件配置
 */
export function init(options) {
  setConfig(options);
  behavior();
  performance();
  error();
}

export default {
  install,
  errorBoundary,
  init,
  behavior,
  performance,
  error
};
