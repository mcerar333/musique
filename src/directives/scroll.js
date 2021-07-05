/* eslint-disable no-underscore-dangle */

export default {
  beforeMount(el, binding) {
    const element = el;
    element._handleScrollHandler = e => binding.value(e);

    document.body.addEventListener('wheel', el._handleScrollHandler);
    document.body.addEventListener('touchmove', el._handleScrollHandler);
  },
  beforeUnmount(el) {
    document.body.removeEventListener('wheel', el._handleScrollHandler);
    document.body.removeEventListener('touchmove', el._handleScrollHandler);
  },
};
