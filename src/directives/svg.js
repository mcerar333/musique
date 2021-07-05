export default {
  beforeMount(el, binding) {
    const path =
      binding.arg === 'full'
        ? binding.value
        : `/assets/img/sprite.svg#${binding.value}`;

    const snippet = `
      <svg>
        <use href="${path}"></use>
      </svg>`;

    const position = binding.modifiers.end ? 'beforeend' : 'afterbegin';

    el.insertAdjacentHTML(position, snippet);
  },
};
