import { lazyReportBatch } from '../report';

export default function error() {
  // 捕获资源加载失败的错误 js 、css、图片等
  window.addEventListener(
    'error',
    function (e) {
      const target = e.target;
      if (!target) return;
      if (target.src || target.href) {
        const url = target.src || target.href;
        const reportData = {
          type: 'error',
          subType: 'resource',
          url: url,
          html: target.outerHTML,
          pageUrl: window.location.href,
          paths: e.path,
          startTime: e.timeStamp // 错误时间
        };
        // 上报
        lazyReportBatch(reportData);
      }
    },
    true
  );
  // 捕获js错误（同异步）
  window.onerror = function (message, source, lineno, colno, error) {
    const reportData = {
      type: 'error',
      subType: 'js',
      url: source,
      message: message,
      source: source,
      lineNo: lineno,
      columnNo: colno,
      stack: error.stack,
      pageUrl: window.location.href,
      startTime: error.timeStamp
    };
    // 上报
    lazyReportBatch(reportData);
  };
  // 捕获promise、async/await错误
  window.addEventListener(
    'unhandledrejection',
    function (e) {
      const reportData = {
        type: 'error',
        subType: 'promise',
        reason: e.reason,
        pageUrl: window.location.href,
        startTime: e.timeStamp
      };
      // 上报
      lazyReportBatch(reportData);
    },
    true
  );
}
