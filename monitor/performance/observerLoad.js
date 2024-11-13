export default function observerrLoad() {
  window.addEventListener('pageShow', (event) => {
    requestAnimationFrame(() => {
      ['load'].forEach((type) => {
        const reportData = {
          type: 'performance',
          subType: type,
          pageUrl: window.location.href,
          startTime: performance.now() - event.timeStamp
        };
      });
    }, true);
  });
}
