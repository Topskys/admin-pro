/**
 * React 基本结构实现
 * 虚拟dom、fiber、diff算法、commit虚拟dom渲染
 */
const React = {
  /**
   * 创建虚拟元素
   * @param {string} type
   * @param {*} props
   * @param  {...any} children
   * @returns
   */
  createElement: (type, props, ...children) => {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => (typeof child === 'object' ? child : React.createTextElement(child)))
      }
    };
  },
  /**
   * 创建文本虚拟节点
   * @param {string} text
   * @returns
   */
  createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: []
      }
    };
  }
};

let nextUnitOfWork = null; // 下一个工作单元
let wipRoot = null; // 正在构建的fiber树
let currentRoot = null; // 旧的fiber树
let deletions = null; // 存储要删除的fiber节点

/**
 * 渲染虚拟dom
 * @param {object} element
 * @param {HTMLElement} container
 */
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot // 链接到旧的fiber树
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
  // 实际React不使用requestIdleCallback API而是使用MessageChannel
  requestIdleCallback(workLoop, { timeout: 500 });
}

/**
 * 任务时间切片
 * @param {*} deadline
 */
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // nextUnitOfWork为null表示所有任务都执行完成并且还有待提交的工作根
  if (!nextUnitOfWork && wipRoot) {
    commitRoot(); // 提交fiber树到真实dom
  }
  // 递归调用requestIdleCallback
  requestIdleCallback(workLoop, { timeout: 500 });
}

/**
 * 生成fiber树
 * @param {object} fiber
 */
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // 遍历子节点
  reconcileChildren(fiber, fiber.props.children);
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling; // 返回兄弟节点
    }
    nextFiber = nextFiber.parent; // 没有兄弟节点就回溯到父节点
  }
  return null;
}

/**
 * 创建虚拟dom并更新属性
 * @param {object} fiber
 * @returns
 */
function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props); // 更新属性
  return dom;
}

/**
 * 更新属性
 * @param {fiber} dom
 * @param {*} prevProps
 * @param {*} nextProps
 */
function updateDom(dom, prevProps, nextProps) {
  // 移除旧的或已删除的属性
  Object.keys(prevProps)
    .filter((key) => key !== 'children')
    .forEach((name) => {
      dom[name] = '';
    });
  // 更新或添加新的属性
  Object.keys(nextProps)
    .filter((key) => key !== 'children')
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
}

/**
 * 实现fiber树和diff算法（增删改）
 * @param {object} fiber
 */
function reconcileChildren(fiber, elements) {
  // fiber树
  //   let index = 0;
  //   let prevSibling = null;
  //   while (index < elements.length) {
  //     const element = elements[index];
  //     const newFiber = {
  //       type: element.type,
  //       props: element.props,
  //       parent: fiber,
  //       dom: null
  //     };
  //     if (index == 0) {
  //       // 第一个子节点
  //       fiber.child = newFiber;
  //     } else if (element) {
  //       // 相邻子节点
  //       prevSibling.sibling = newFiber;
  //     }
  //     prevSibling = newFiber;
  //     index++;
  //   }
  let index = 0;
  let prevSibling = null;
  let oldFiber = fiber.alternate && fiber.alternate.child; // 旧fiber树
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && element.type === oldFiber.type;
    // 1.更新
    if (sameType) {
      console.log('复用');
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        parent: fiber,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      };
    }
    // 2.新增
    if (element && !sameType) {
      console.log('新增');
      newFiber = createFiber(element, fiber);
      newFiber.effectTag = 'PLACEMENT';
    }
    // 3.删除
    if (oldFiber && !sameType) {
      console.log('删除');
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }
    // 删除后移动到下一个兄弟节点
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index == 0) {
      // 第一个子节点
      fiber.child = newFiber;
    } else if (element) {
      // 相邻子节点
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}

/**
 * 创建fiber元素
 * @param {*} element 子元素
 * @param {object} parent fiber树
 * @returns
 */
function createFiber(element, parent) {
  return {
    type: element.type,
    props: element.props,
    parent,
    dom: null,
    child: null,
    sibling: null,
    alternate: null,
    effectTag: null // 新增、更新、删除
  };
}

/**
 * 提交fiber树到真实dom
 */
function commitRoot() {
  deletions.forEach(commitWork); // 删除节点
  commitWork(wipRoot.child);
  currentRoot = wipRoot; // 存储旧的fiber树
  wipRoot = null; // 重置
}

/**
 * 更新真实dom
 * @param {object} fiber
 * @returns
 */
function commitWork(fiber) {
  if (!fiber) return;
  const domParent = fiber.parent.dom;
  if (fiber.effectTag === 'PLACEMENT') {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE') {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child); // 递归子节点
  commitWork(fiber.sibling); // 递归兄弟节点
}

// 测试
const vDom1 = React.createElement('div', { id: 'root' }, React.createElement('h1', null, 'Hello, world!'));
const vDom2 = React.createElement('div', { id: 'root' }, React.createElement('p', { classList: 'p-10' }, 'p新元素'));
const vDom3 = React.createElement(
  'div',
  { id: 'root' },
  React.createElement('p', { classList: 'p-10' }, '复用元素'),
  React.createElement('h2', { classList: 'h2-10' }, 'h2新元素')
);

console.log('vDom1', vDom1, 'vDom2', vDom2);
const container = document.getElementById('app');
render(vDom1, container);
setTimeout(() => {
  render(vDom2, container);
}, 2000);

setTimeout(() => {
  render(vDom3, container);
}, 3000);
