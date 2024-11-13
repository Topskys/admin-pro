/**
 * 自定义Vue 错误处理插件
 * @param app vue实例
 * @param options 配置项
 * 注册：app.use(errorHandlerPlugin, options)
 * 使用：this.$errorHandlerPlugin('key')
 */
export function install(app: any, options: any) {
  app.config.globalProperties.$errorHandlerPlugin = (key: any) => {
    return key.split('.').reduce((o, i) => {
      // TODO: Vue上报错误
      console.log(o, i);
    }, options);
  };
}

// 或者
export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$errorHandlerPlugin = (key: any) => {
      return key.split('.').reduce((o, i) => {
        // TODO: Vue上报错误
        console.log(o, i);
      }, options);
    };
  }
};
