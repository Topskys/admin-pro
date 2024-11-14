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

export function setConfig(options) {
  for (let key in config) {
    if (options[key]) {
      config[key] = options[key];
    }
  }
}

export default config;
