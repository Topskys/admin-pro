var monitor = (function (exports) {
  'use strict';

  var config = {
    name: 'monitor',
    url: 'http://localhost:3000',
    projectName: 'eyesdk',
    projectVersion: '0.0.1',
    userId: '123456',
    appId: '123456',
    isImageUpload: false,
    batchSize: 20 // 緩存數據數量，超過就發送
  };
  function setConfig(options) {
    for (var key in config) {
      if (options[key]) {
        config[key] = options[key];
      }
    }
  }

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _createForOfIteratorHelper(r, e) {
    var t = ('undefined' != typeof Symbol && r[Symbol.iterator]) || r['@@iterator'];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length
              ? {
                  done: !0
                }
              : {
                  done: !1,
                  value: r[n++]
                };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError(
        'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
      );
    }
    var o,
      a = !0,
      u = !1;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return (a = r.done), r;
      },
      e: function (r) {
        (u = !0), (o = r);
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _defineProperty(e, r, t) {
    return (
      (r = _toPropertyKey(r)) in e
        ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
          })
        : (e[r] = t),
      e
    );
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r &&
        (o = o.filter(function (r) {
          return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })),
        t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2
        ? ownKeys(Object(t), !0).forEach(function (r) {
            _defineProperty(e, r, t[r]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
          : ownKeys(Object(t)).forEach(function (r) {
              Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
            });
    }
    return e;
  }
  function _toPrimitive(t, r) {
    if ('object' != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || 'default');
      if ('object' != typeof i) return i;
      throw new TypeError('@@toPrimitive must return a primitive value.');
    }
    return ('string' === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, 'string');
    return 'symbol' == typeof i ? i : i + '';
  }
  function _typeof(o) {
    '@babel/helpers - typeof';

    return (
      (_typeof =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (o) {
              return typeof o;
            }
          : function (o) {
              return o && 'function' == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype
                ? 'symbol'
                : typeof o;
            }),
      _typeof(o)
    );
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ('string' == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return (
        'Object' === t && r.constructor && (t = r.constructor.name),
        'Map' === t || 'Set' === t
          ? Array.from(r)
          : 'Arguments' === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
            ? _arrayLikeToArray(r, a)
            : void 0
      );
    }
  }

  /**
   * 深度克隆
   * @param {object} target
   * @returns any
   */
  function deepCopy(target) {
    if (_typeof(target) !== 'object') return target;
    var result = Array.isArray(target) ? [] : {};
    for (var key in target) {
      if (_typeof(target[key]) === 'object') {
        result[key] = deepCopy(target[key]);
      } else {
        result[key] = target[key];
      }
    }
    return result;
  }

  /**
   * 生成唯一id
   * @returns string
   */
  function generateUniqueId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }

  /**
   * 缓存数据，用於批量上報數據等
   */
  var cache = [];

  /**
   * 獲取緩存數據
   * @returns 深拷貝的數據
   */
  function getCache() {
    return deepCopy(cache);
  }

  /**
   * 添加緩存數據
   * @param {any} data
   */
  function addCache(data) {
    cache.push(data);
  }

  /**
   * 清空緩存數據
   */
  function clearCache() {
    cache.length = 0;
  }

  var originalProto$1 = XMLHttpRequest.prototype;
  var originalOpen$1 = originalProto$1.open;
  var originalSend$1 = originalProto$1.send;

  /**
   * 上報數據
   * @param {any} data 上報的數據
   */
  function report(data) {
    if (!config.url) {
      console.error('请配置上报 url 地址');
    }
    var reportData = JSON.stringify({
      id: generateUniqueId(),
      data: data
    });
    if (!(config !== null && config !== void 0 && config.isImageUpload)) {
      var _window$navigator;
      // 優先使用sendBeacon上報數據
      if (
        (_window$navigator = window.navigator) !== null &&
        _window$navigator !== void 0 &&
        _window$navigator.sendBeacon
      ) {
        return sendBeaconRequest(reportData);
      }
      return xhrRequest(reportData);
    }
    return imgRequest(reportData);
  }

  /**
   * 批量上報數據
   * @param {any} data 上報的數據
   */
  function lazyReportBatch(data) {
    addCache(data);
    var cacheData = getCache();
    console.log('cacheData', cacheData);
    if (cacheData.length && cacheData.length >= config.batchSize) {
      report(cacheData);
      clearCache();
    }
  }

  /**
   * 使用圖片請求發送數據
   * @param {string} url 上報地址
   * @param {any} data 上報的數據
   */
  function imgRequest(data) {
    var img = new Image();
    // 發送數據
    img.src = ''.concat(config.url, '?data=').concat(encodeURIComponent(JSON.stringify(data)));
  }

  /**
   * 普通ajax發送請求數據
   * @param {any} data
   */
  function xhrRequest(data) {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(
        function () {
          var xhr = new XMLHttpRequest();
          originalOpen$1.call(xhr, 'POST', config.url);
          originalSend$1.call(xhr, JSON.stringify(data));
        },
        {
          timeout: 3000
        }
      );
    } else {
      setTimeout(function () {
        var xhr = new XMLHttpRequest();
        originalOpen$1.call(xhr, 'POST', config.url);
        originalSend$1.call(xhr, JSON.stringify(data));
      });
    }
  }

  // const sendBeacon = isSupportSendBeacon() ? navigator.sendBeacon : xhrRequest;

  /**
   * 使用sendBeacon發送上報數據
   * @param {any} data 上報數據
   */
  function sendBeaconRequest(data) {
    // 如果瀏覽器空閒時間大於3s會發送上報數據
    if (window.requestIdleCallback) {
      window.requestIdleCallback(
        function () {
          window.navigator.sendBeacon(config.url, data);
        },
        {
          timeout: 3000
        }
      );
    } else {
      setTimeout(function () {
        window.navigator.sendBeacon(config.url, data);
      });
    }
  }

  /**
   * 監聽點擊觸摸事件
   */
  function click() {
    ['mousedown', 'touchstart'].forEach(function (eventType) {
      window.addEventListener(eventType, function (e) {
        var target = e.target;
        if (!target.tagName) return; // 忽略非元素节点的處理
        var reportData = {
          type: 'behavior',
          subType: 'click',
          target: target.tagName,
          innerHtml: target.innerHTML,
          outerHtml: target.outerHTML,
          width: target.offsetWidth,
          height: target.offsetHeight,
          pageUrl: window.location.href,
          eventType: eventType,
          paths: e.path,
          startTime: e.timeStamp,
          scrollTop: document.documentElement.scrollTop || document.body.scrollTop
        };
        lazyReportBatch(reportData);
      });
    });
  }

  /**
   * 監聽路由跳轉
   * 監聽hashchange 和 popstate 事件
   */
  function pageChange() {
    // 监听hash路由
    var oldUrl = '';
    window.addEventListener(
      'hashchange',
      function (e) {
        var newUrl = e.newURL;
        var reportData = {
          type: 'behavior',
          subType: 'hashchange',
          from: oldUrl,
          to: newUrl,
          uuid: generateUniqueId(),
          startTime: this.performance.now() || e.timeStamp
        };
        lazyReportBatch(reportData);
        oldUrl = newUrl;
      },
      true
    );

    // 監聽history路由
    var from = '';
    window.addEventListener(
      'popstate',
      function (e) {
        var to = e.newURL;
        var reportData = {
          type: 'behavior',
          subType: 'popstate',
          from: from,
          to: to,
          uuid: generateUniqueId(),
          startTime: this.performance.now() || e.timeStamp
        };
        lazyReportBatch(reportData);
        from = to;
      },
      true
    );
  }

  function pv() {
    var reportData = {
      type: 'behavior',
      subType: 'pv',
      startTime: performance.now(),
      pageUrl: window.location.href,
      referrer: document.referrer,
      uuid: generateUniqueId()
    };
    lazyReportBatch(reportData);
  }

  function behavior() {
    click();
    pageChange();
    pv();
  }

  var originalFetch = window.fetch;
  function overwriteFetch() {
    window.fetch = function (url, config) {
      var startTime = Date.now();
      var reportData = {
        type: 'performance',
        subType: 'fetch',
        startTime: startTime,
        url: url,
        method: config.method.toUpperCase(),
        headers: config.headers,
        body: config.body,
        credentials: config.credentials
      };
      return originalFetch(url, config)
        .then(function (res) {
          var endTime = Date.now();
          reportData.endTime = endTime;
          reportData.duration = endTime - startTime;
          var data = res.clone();
          reportData.status = data.status;
          reportData.success = data.ok;
          // TODO: 上报
          lazyReportBatch(reportData);
          return res;
        })
        .catch(function (err) {
          var endTime = Date.now();
          reportData.endTime = endTime;
          reportData.duration = endTime - startTime;
          reportData.success = false;
          reportData.status = 0;
          // TODO: 上报
          lazyReportBatch(reportData);
        });
    };
  }
  function fetch() {
    overwriteFetch();
  }

  var originalProto = XMLHttpRequest.prototype;
  var originalOpen = originalProto.open;
  var originalSend = originalProto.send;
  function xhr() {
    overwriteOpenAndSend();
  }
  function overwriteOpenAndSend() {
    originalProto.open = function newOpen() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      this.method = args[0];
      this.url = args[1];
      return originalOpen.apply(this, args);
    };
    originalProto.send = function newSend() {
      var _this = this;
      this.startTime = Date.now();
      var _onLoaded = function onLoaded() {
        _this.endTime = Date.now();
        _this.duration = _this.endTime - _this.startTime;
        var url = _this.url,
          method = _this.method,
          startTime = _this.startTime,
          endTime = _this.endTime,
          duration = _this.duration,
          status = _this.status;
        var reportData = {
          status: status,
          duration: duration,
          endTime: endTime,
          startTime: startTime,
          url: url,
          method: method.toUpperCase(),
          type: 'performance',
          success: status >= 200 && status < 300,
          subType: 'xhr'
        };
        // TODO: 上报
        lazyReportBatch(reportData);
        _this.removeEventListener('loadend', _onLoaded, true);
      };
      // 监听xhr请求完成后触发onLoaded
      this.addEventListener('loadend', _onLoaded, true);
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      originalSend.apply(this, args);
    };
  }

  function observerEntries() {
    if (document.readyState === 'complete') {
      // 页面加载完成时执行
      observerEvent();
    } else {
      var _onLoad = function onLoad() {
        observerEvent();
        window.removeEventListener('load', _onLoad, true);
      };
      window.addEventListener('load', _onLoad, true); // 捕获事件
    }
  }
  function observerEvent() {
    var entryHandler = function entryHandler(list) {
      var entries = list.getEntries();
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var entry = _step.value;
          if (entry.name === 'resource') {
            observer === null || observer === void 0 || observer.disconnect();
            var reportData = {
              name: entry.name,
              // 资源名称
              type: 'performance',
              // 类型
              subType: entry.entryType,
              // 类型
              url: window.location.href,
              sourceType: entry.initiatorType,
              // 资源发起类型
              duration: entry.duration,
              // 资源加载耗时
              dns: entry.domainLookupEnd - entry.domainLookupStart,
              // DNS解析耗时
              tcp: entry.connectEnd - entry.connectStart,
              // TCP连接耗时
              redirect: entry.redirectEnd - entry.redirectStart,
              // 重定向耗时
              ttfb: entry.responseStart,
              // 首字节时间
              protocol: entry.nextHopProtocol,
              // 请求协议
              responseBodySize: entry.encodedBodySize,
              // 响应体大小
              responseHeaderSize: entry.transferSize - entry.encodedBodySize,
              // 响应头大小
              transferSize: entry.transferSize,
              // 请求内容大小
              resourceSize: entry.decodedBodySize,
              // 资源加压后的大小
              startTime: performance.now(),
              // 开始时间
              request: entry.responseEnd - entry.requestStart,
              // 请求耗时
              response: entry.responseEnd - entry.responseStart // 响应耗时
            };
            // TODO: 上报数据
            lazyReportBatch(reportData);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    // 统计和计算
    var observer = new PerformanceObserver(entryHandler);
    observer.observe({
      type: ['resource'],
      buffered: true
    });
  }

  function observerLCP$1() {
    var entryHandler = function entryHandler(list) {
      var entries = list.getEntries();
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var entry = _step.value;
          if (entry.name === 'first-contentful-paint') {
            observer.disconnect();
            var json = entry.toJSON();
            var reportData = _objectSpread2(
              _objectSpread2({}, json),
              {},
              {
                type: 'performance',
                subType: entry.name,
                url: window.location.href
              }
            );
            // 上报数据
            lazyReportBatch(reportData);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    // 统计和计算 LCP
    var observer = new PerformanceObserver(entryHandler);
    observer.observe({
      type: 'paint',
      buffered: true
    });
  }

  function observerLCP() {
    var entryHandler = function entryHandler(list) {
      var entries = list.getEntries();
      observer === null || observer === void 0 || observer.disconnect();
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var entry = _step.value;
          var json = entry.toJSON();
          var reportData = _objectSpread2(
            _objectSpread2({}, json),
            {},
            {
              type: 'performance',
              subType: entry.name,
              pageUrl: window.location.href
            }
          );
          // TODO: 上报数据
          lazyReportBatch(reportData);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    // 统计和计算 LCP
    var observer = new PerformanceObserver(entryHandler);
    observer.observe({
      type: 'largest-contentful-paint',
      buffered: true
    });
  }

  function observerLoad() {
    window.addEventListener('pageShow', function (event) {
      requestAnimationFrame(function () {
        ['load'].forEach(function (type) {
          var reportData = {
            type: 'performance',
            subType: type,
            pageUrl: window.location.href,
            startTime: performance.now() - event.timeStamp
          };
          lazyReportBatch(reportData);
        });
      }, true);
    });
  }

  function observerPaint() {
    var entryHandler = function entryHandler(list) {
      var entries = list.getEntries();
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var entry = _step.value;
          if (entry.name === 'first-paint') {
            observer.disconnect();
            var json = entry.toJSON();
            var reportData = _objectSpread2(
              _objectSpread2({}, json),
              {},
              {
                type: 'performance',
                subType: entry.name,
                url: window.location.href
              }
            );
            // 上报数据
            lazyReportBatch(reportData);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    // 统计和计算 FP 的时间
    var observer = new PerformanceObserver(entryHandler);
    // buffered: true 确保观察到paint事件
    observer.observe({
      type: 'paint',
      buffered: true
    });
  }

  function performance$1() {
    observerEntries();
    observerLCP$1();
    observerLCP();
    observerLoad();
    observerPaint();
    fetch();
    xhr();
  }

  function error() {
    // 捕获资源加载失败的错误 js 、css、图片等
    window.addEventListener(
      'error',
      function (e) {
        var target = e.target;
        if (!target) return;
        if (target.src || target.href) {
          var url = target.src || target.href;
          var reportData = {
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
      var reportData = {
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
        var reportData = {
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

  /**
   * 錯誤上報插件
   * @module webEyeSDK
   * @description 錯誤上報插件，提供對Vue項目進行錯誤處理，對React項目進行錯誤處理
   */
  window.__webEyeSDK__ = {
    version: '0.0.1'
  };

  /**
   * 針對Vue項目進行錯誤處理
   * @param {vue} Vue Vue實例
   * @param {object} options 配置項
   * @returns
   */
  function install(Vue, options) {
    if (__webEyeSDK__.vue) return;
    __webEyeSDK__.vue = true;
    setConfig(options);
    var handler = Vue.config.errorHandler;
    Vue.config.errorHandler = function (err, vm, info) {
      // 上報具體的錯誤信息
      var reportData = {
        info: info,
        error: err === null || err === void 0 ? void 0 : err.stack,
        subType: 'vue',
        type: 'error',
        startTime: window.performance.now(),
        pageUrl: window.location.href
      };
      lazyReportBatch(reportData);
      if (handler) {
        handler.call(this, err, vm, info);
      }
    };
  }

  /**
   * 針對React項目進行錯誤處理
   * @param {any} err
   * @param {any} info
   * @returns
   */
  function errorBoundary(err, info) {
    if (__webEyeSDK__.react) return;
    __webEyeSDK__.react = true;
    // 上報具體的錯誤信息
    var reportData = {
      info: info,
      error: err === null || err === void 0 ? void 0 : err.stack,
      subType: 'react',
      type: 'error',
      startTime: window.performance.now(),
      pageUrl: window.location.href
    };
    lazyReportBatch(reportData);
  }

  /**
   * 初始化插件配置
   */
  function init(options) {
    setConfig(options);
    behavior();
    performance$1();
    error();
  }
  var webEyeSDK = {
    install: install,
    errorBoundary: errorBoundary,
    init: init,
    behavior: behavior,
    performance: performance$1,
    error: error
  };

  exports.default = webEyeSDK;
  exports.init = init;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
})({});
//# sourceMappingURL=monitor.js.map
