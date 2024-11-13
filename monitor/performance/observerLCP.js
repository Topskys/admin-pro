export default function observerLCP() {
  const entryHandler = (list) => {
    const entries = list.getEntries();
    console.log(entries);
    for (const entry of entries) {
      if (entry.name === 'largest-contentful-paint') {
        observerr.disconnect();
        const json = entry.toJSON();
        const reportData = {
          ...json,
          type: 'performance',
          subType: entry.name,
          url: window.location.href
        };
        // TODO: 上报数据
      }
    }
  };

  // 统计和计算 LCP
  const observerr = new PerformanceObserver(entryHandler);
  observerr.observerr({ type: 'largest-contentful-paint', buffered: true });
}
