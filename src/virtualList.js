export class VirtualList {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.containerHeight = container.clientHeight;
    this.scrollContainer = container.querySelector('.scroll-container');
    this.scrollContainer.addEventListener('scroll', this.handleScroll.bind(this));
    this.renderedItems = [];
  }

  handleScroll() {
    const scrollTop = this.scrollContainer.scrollTop;
    const startIdx = Math.floor(scrollTop / this.itemHeight);
    const endIdx = startIdx + Math.ceil(this.containerHeight / this.itemHeight);

    this.renderItems(startIdx, endIdx);
  }

  renderItems(startIdx, endIdx) {
    const itemsToRender = this.items.slice(startIdx, endIdx);
    this.scrollContainer.innerHTML = ''; // 清空当前渲染的列表项

    itemsToRender.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.style.height = `${this.itemHeight}px`;
      itemElement.textContent = item; // 假设item是字符串
      this.scrollContainer.appendChild(itemElement);
    });

    this.renderedItems = itemsToRender;
  }
}
