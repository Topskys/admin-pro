import { lazyReportBatch } from '../report';

export default function observerLCP() {
  /**
   * 处理入口数据
   *
   * @param list 性能条目列表
   */
  const entryHandler = (list) => {
    const entries = list.getEntries();
    observer?.disconnect();
    for (const entry of entries) {
      const json = entry.toJSON();
      const reportData = {
        ...json,
        type: 'performance',
        subType: entry.name,
        pageUrl: window.location.href
      };
      // TODO: 上报数据
      lazyReportBatch(reportData);
    }
  };

  // 统计和计算 LCP
  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
}
