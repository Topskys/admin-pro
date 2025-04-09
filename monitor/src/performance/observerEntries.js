import { lazyReportBatch } from '../report';

export default function observerEntries() {
  if (document.readyState === 'complete') {
    // 页面加载完成时执行
    observerEvent();
  } else {
    /**
     * 当页面加载完成后执行的函数
     */
    const onLoad = () => {
      observerEvent();
      window.removeEventListener('load', onLoad, true);
    };
    window.addEventListener('load', onLoad, true); // 捕获事件
  }
}

/**
 * 观察性能事件，收集资源加载的性能数据，并进行上报
 */
export function observerEvent() {
  /**
   * 入口处理函数
   *
   * @param list 性能条目列表
   */
  const entryHandler = (list) => {
    const entries = list.getEntries();
    for (const entry of entries) {
      if (entry.name === 'resource') {
        observer?.disconnect();
        const reportData = {
          name: entry.name, // 资源名称
          type: 'performance', // 类型
          subType: entry.entryType, // 类型
          url: window.location.href,
          sourceType: entry.initiatorType, // 资源发起类型
          duration: entry.duration, // 资源加载耗时
          dns: entry.domainLookupEnd - entry.domainLookupStart, // DNS解析耗时
          tcp: entry.connectEnd - entry.connectStart, // TCP连接耗时
          redirect: entry.redirectEnd - entry.redirectStart, // 重定向耗时
          ttfb: entry.responseStart, // 首字节时间
          protocol: entry.nextHopProtocol, // 请求协议
          responseBodySize: entry.encodedBodySize, // 响应体大小
          responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头大小
          transferSize: entry.transferSize, // 请求内容大小
          resourceSize: entry.decodedBodySize, // 资源加压后的大小
          startTime: performance.now(), // 开始时间
          request: entry.responseEnd - entry.requestStart, // 请求耗时
          response: entry.responseEnd - entry.responseStart // 响应耗时
        };
        // 上报数据
        lazyReportBatch(reportData);
      }
    }
  };

  // 统计和计算
  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: ['resource'], buffered: true });
}
