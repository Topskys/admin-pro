import { lazyReportBatch } from '../report';
import { generateUniqueId } from '../utils';

// 页面浏览量监控函数
export default function pv() {
  const reportData = {
    type: 'behavior', // 监控类型为行为
    subType: 'pv', // Page View，页面浏览量
    startTime: performance.now(),
    pageUrl: window.location.href, // 当前页面的URL
    referrer: document.referrer, // 来源页面的URL
    uuid: generateUniqueId()
  };
  lazyReportBatch(reportData);
}
