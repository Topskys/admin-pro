import { lazyReportBatch } from '../report';

const originalFetch = window.fetch;

/**
 * 重写 fetch 方法以收集性能数据
 *
 * @returns 无返回值
 */
function overwriteFetch() {
  window.fetch = function (url, config) {
    const startTime = Date.now();
    const reportData = {
      type: 'performance',
      subType: 'fetch',
      startTime,
      url,
      method: config.method.toUpperCase(),
      headers: config.headers,
      body: config.body,
      credentials: config.credentials
    };

    return originalFetch(url, config)
      .then((res) => {
        const endTime = Date.now();
        reportData.endTime = endTime;
        reportData.duration = endTime - startTime;
        const data = res.clone();
        reportData.status = data.status;
        reportData.success = data.ok;
        // 上报
        lazyReportBatch(reportData);
        return res;
      })
      .catch((err) => {
        const endTime = Date.now();
        reportData.endTime = endTime;
        reportData.duration = endTime - startTime;
        reportData.success = false;
        reportData.status = 0;
        // 上报
        lazyReportBatch(reportData);
      });
  };
}

export default function fetch() {
  overwriteFetch();
}
