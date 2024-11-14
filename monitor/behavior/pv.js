import { lazyReportBatch } from '../report';
import { generateUniqueId } from '../utils';

export default function pv() {
  reportData({
    type: 'behavior',
    subType: 'pv',
    startTime: performance.now(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    uuid: generateUniqueId()
  });
  lazyReportBatch(reportData);
}
