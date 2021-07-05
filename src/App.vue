<template>
  <TheHeader />

  <teleport to="body">
    <TheAuthModal />
  </teleport>

  <main class="content">
    <router-view v-slot="{ Component }">
      <transition name="r" mode="out-in" appear>
        <component :is="Component"></component>
      </transition>
    </router-view>
  </main>

  <TheAudioPlayer />
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import TheAuthModal from '@/components/TheAuthModal.vue';
import TheAudioPlayer from '@/components/TheAudioPlayer.vue';

export default {
  name: 'App',
  components: { TheHeader, TheAuthModal, TheAudioPlayer },

  created() {
    this.$store.dispatch('initAuth');
  },
};
</script>

<style lang="scss">
.r-enter-from {
  opacity: 0;
}
.r-enter-active {
  transition: opacity 0.3s ease-in;
}
.r-leave-to {
  opacity: 0;
  transition: opacity 0.3s ease-out;
}
</style>
