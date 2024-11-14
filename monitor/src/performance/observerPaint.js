import { lazyReportBatch } from '../report';

export default function observerPaint() {
  const entryHandler = (entries) => {
    console.log(entries);
    for (const entry of entries) {
      if (entry.name === 'first-paint') {
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

  // 统计和计算 FP 的时间
  const observer = new PerformanceObserver(entryHandler);
  // buffered: true 确保观察到paint事件
  observer.observe({ type: 'paint', buffered: true });
}
