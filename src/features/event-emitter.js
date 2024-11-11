/**
 * 发布订阅模式
 */
class EventEmitter {
  constructor() {
    // 存储事件名称和事件数组的映射关系
    this.events = {
      // 'event1': [ cb1 ],
    };
  }

  /**
   * 订阅事件
   * @param {string} eventName
   * @param {Function} callback
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  /**
   * 发布事件
   * @param {string} eventName
   * @param  {...any} args
   */
  emit(eventName, ...args) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach((callback) => callback(...args));
  }

  /**
   * 取消订阅事件
   * @param {string} eventName
   * @param {Function} callback
   */
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
  }
}

// 示例
const emitter = new EventEmitter();

// 订阅事件
const onEvent1 = (data) => {
  console.log('event1', data);
};
const onEvent11 = (...args) => {
  console.log('event1', args);
};
const onEvent2 = (data) => {
  console.log('event2', data);
};
emitter.on('event1', onEvent1);
emitter.on('event2', onEvent2);
emitter.on('event1', onEvent11);

// 发布事件
emitter.emit('event1', { name: 'event1' });
emitter.emit('event1', { name: 'event1', age: 18 });

// 取消订阅事件
emitter.off('event1', onEvent1);
