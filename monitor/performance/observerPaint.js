export default function observerPaint() {
  const entryHandler = (entries) => {
    console.log(entries);
    for (const entry of entries) {
      if (entry.name === 'first-paint') {
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

  // 统计和计算 FP 的时间
  const observerr = new PerformanceObserver(entryHandler);
  // buffered: true 确保观察到paint事件
  observerr.observerr({ type: 'paint', buffered: true });
}
