import { lazyReportBatch } from '../report';

export default function observerLCP() {
  const entryHandler = (list) => {
    const entries = list.getEntries();
    console.log(entries);
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
        // TODO: 上报数据
        lazyReportBatch(reportData);
      }
    }
  };

  // 统计和计算 LCP
  const observer = new PerformanceObserver(entryHandler);
  observer.observer({ type: 'first-contentful-paint', buffered: true });
}
