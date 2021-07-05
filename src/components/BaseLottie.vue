<template>
  <div class="lottie-container" ref="lottie"></div>
</template>

<script>
import lottie from 'lottie-web';

export default {
  name: 'BaseLottie',

  props: {
    options: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      anim: null,
    };
  },
  mounted() {
    this.anim = lottie.loadAnimation({
      renderer: 'svg',
      container: this.$refs.lottie,
      loop: this.options.loop ?? true,
      autoplay: this.options.autoplay ?? true,
      animationData: this.options.animationData,
      rendererSettings: this.options.rendererSettings,
    });
  },
  beforeUnmount() {
    lottie.destroy();
  },
};
</script>

<style lang="scss">
.lottie-container {
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}
</style>
