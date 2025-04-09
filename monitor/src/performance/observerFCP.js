import { lazyReportBatch } from '../report';

export default function observerLCP() {
  /**
   * 处理性能监控入口函数
   *
   * @param list - 性能监控列表
   */
  const entryHandler = (list) => {
    const entries = list.getEntries();
    for (const entry of entries) {
      if (entry.name === 'first-contentful-paint') {
        observer.disconnect();
        const json = entry.toJSON();
        const reportData = {
          ...json,
          type: 'performance',
          subType: entry.name,
          url: window.location.href
        };
        // 上报数据
        lazyReportBatch(reportData);
      }
    }
  };

  // 统计和计算 LCP
  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'paint', buffered: true });
}
