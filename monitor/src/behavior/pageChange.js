import { lazyReportBatch } from '../report';
import { generateUniqueId } from '../utils';

/**
 * 監聽路由跳轉
 * 監聽 hashchange 和 popstate 事件
 */
export default function pageChange() {
  // 监听hash路由
  let oldUrl = '';
  window.addEventListener(
    'hashchange',
    function (e) {
      const newUrl = e.newURL;
      const reportData = {
        type: 'behavior',
        subType: 'hashchange',
        from: oldUrl,
        to: newUrl,
        uuid: generateUniqueId(),
        startTime: this.performance.now() || e.timeStamp
      };
      // TODO: 在此可統計pv
      lazyReportBatch(reportData);
      oldUrl = newUrl;
    },
    true
  );

  // 監聽history路由
  let from = '';
  window.addEventListener(
    'popstate',
    function (e) {
      const to = e.newURL;
      const reportData = {
        type: 'behavior',
        subType: 'popstate',
        from,
        to,
        uuid: generateUniqueId(),
        startTime: this.performance.now() || e.timeStamp
      };
      // TODO: 在此可統計pv
      lazyReportBatch(reportData);
      from = to;
    },
    true
  );
}
