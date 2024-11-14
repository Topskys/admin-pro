import behavior from './behavior';
import performance from './performance';
import error from './error';
import { setConfig } from './config';

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
  const handler = Vue.config.errorHandler;
  Vue.config.errorHandler = function (err, vm, info) {
    // TODO: 上報具體的錯誤信息
    if (handler) {
      handler.call(this, err, vm, info);
      // console.log('err', err, vm, info, a);
    }
  };
}

/**
 * 針對React項目進行錯誤處理
 * @param {any} err
 * @returns
 */
function errorBoundary(err) {
  if (__webEyeSDK__.react) return;
  __webEyeSDK__.react = true;
  // TODO: 上報具體錯誤信息
}

/**
 * 初始化插件配置
 */
export function init(options) {
  setConfig(options);
}

export default {
  install,
  errorBoundary,
  init,
  behavior,
  performance,
  error
};
