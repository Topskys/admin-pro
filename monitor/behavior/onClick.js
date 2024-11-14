import { lazyReportBatch } from '../report';

/**
 * 監聽點擊觸摸事件
 */
export default function click() {
  ['mousedown', 'touchstart'].forEach((eventType) => {
    window.addEventListener(eventType, (e) => {
      const target = e.target;
      if (!target.tagName) return; // 忽略非元素节点的處理
      const reportData = {
        type: 'behavior',
        subType: 'click',
        target: target.tagName,
        innerHtml: target.innerHTML,
        outerHtml: target.outerHTML,
        width: target.offsetWidth,
        height: target.offsetHeight,
        pageUrl: window.location.href,
        eventType,
        paths: e.path,
        startTime: e.timeStamp,
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop
      };
      lazyReportBatch(reportData);
    });
  });
}
