const originalFetch = window.fetch;

function overwriteFetch() {
  window.fetch = function (url, config) {
    const startTime = Date.now();
    const reportData = {
      type: 'performance',
      subType: 'fetch',
      startTime,
      url,
      method: config.method.toUpperCase(),
      headers: config.headers,
      body: config.body,
      credentials: config.credentials
    };

    return originalFetch(url, config)
      .then((res) => {
        const endTime = Date.now();
        reportData.endTime = endTime;
        reportData.duration = endTime - startTime;
        reportData.status = res.status;
        reportData.success = res.ok;
        // TODO: 上报
        return res;
      })
      .catch((err) => {
        const endTime = Date.now();
        reportData.endTime = endTime;
        reportData.duration = endTime - startTime;
        reportData.success = false;
        reportData.status = 0;
        // TODO: 上报
      });
  };
}

export default function fetch() {
  overwriteFetch();
}
