import { setConfig } from './config';
import error from './error/index';
import behavior from './behavior/index';
import performance from './performance/index';
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
 * 安装 Vue 插件，用于捕获 Vue 错误并上报
 *
 * @param {Vue} Vue Vue 对象
 * @param {Object} options 插件配置选项
 * @param {string} options.name 插件名称
 * @param {string} options.url 插件上报的URL
 * @param {string} options.projectName 项目名称
 * @param {string} options.projectVersion 项目版本号
 * @param {string} options.userId 用户ID
 * @param {string} options.appId 应用ID
 * @param {boolean} options.isImageUpload 是否使用图片形式上报
 * @param {number} options.batchSize 批量上报的批次大小（缓存数量）
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
 * 错误边界处理函数（React项目）
 *
 * @param err 错误对象
 * @param info 错误组件堆栈信息
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
 * 初始化插件函数
 *
 * @param {Object} options 插件配置选项
 * @param {string} options.name 插件名称
 * @param {string} options.url 插件上报的URL
 * @param {string} options.projectName 项目名称
 * @param {string} options.projectVersion 项目版本号
 * @param {string} options.userId 用户ID
 * @param {string} options.appId 应用ID
 * @param {boolean} options.isImageUpload 是否使用图片形式上报
 * @param {number} options.batchSize 批量上报的批次大小（缓存数量）
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
