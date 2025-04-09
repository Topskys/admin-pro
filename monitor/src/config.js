const config = {
  name: 'monitor',
  url: 'http://localhost:3000',
  projectName: 'eyesdk',
  projectVersion: '0.0.1',
  userId: '123456',
  appId: '123456',
  isImageUpload: false,
  batchSize: 20 // 緩存數據數量，超過就發送
};

/**
 * 设置配置项
 *
 * @param options 配置对象，包含需要设置的配置项
 * @param {string} options.name 项目名称
 * @param {string} options.url 上报地址
 * @param {string} options.projectName 项目名称
 * @param {string} options.projectVersion 项目版本
 * @param {string} options.userId 用户ID
 * @param {string} options.appId 应用ID
 * @param {boolean} options.isImageUpload 是否上传图片
 * @param {number} options.batchSize 批量发送数据大小
 */
export function setConfig(options) {
  for (let key in config) {
    if (options[key]) {
      config[key] = options[key];
    }
  }
}

export default config;
