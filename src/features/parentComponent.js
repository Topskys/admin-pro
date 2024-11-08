import { createElementVNode } from 'vue';

/**
 * ParentComponent
 * 由父组件接收插槽对象且决定插槽对象渲染的位置
 */
export default {
  setup(props, { slots }) {
    const defaultVNodes = slots.default();
    const slotVNodes1 = slots.slot1();
    const slotVNodes2 = slots.slot2(600);
    console.log(props, slots, defaultVNodes, slotVNodes2);
    return () => {
      return createElementVNode('div', null, [...defaultVNodes, ...slotVNodes1, ...slotVNodes2]);
    };
  }
};
