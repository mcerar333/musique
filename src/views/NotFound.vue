<template>
  <section class="not-found">
    <BaseLottie :options="lottieOptions" />
  </section>
</template>

<script>
import BaseLottie from '@/components/BaseLottie.vue';
import * as animationData from '@/assets/lottie/error.json';

export default {
  name: 'NotFound',
  components: { BaseLottie },

  data() {
    return {
      lottieOptions: { animationData },
    };
  },
};
</script>
