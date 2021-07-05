<template>
  <transition name="auth">
    <div v-if="authModalShown" class="overlay" @click="toggleAuthModal"></div>
  </transition>

  <transition name="auth">
    <dialog v-if="authModalShown" :open="authModalShown" class="modal">
      <header class="modal__header">
        <h2 class="heading-2">
          {{ $t('auth.title') }}
          <span class="heading-2__icon" v-svg="'icon-vynil'"></span>
        </h2>

        <button
          class="modal__close"
          aria-label="close modal"
          v-svg="'icon-cross'"
          @click="toggleAuthModal"
        ></button>
      </header>

      <section class="modal__content">
        <ul class="modal__controls">
          <li>
            <a
              href="#"
              :class="{ 'active-tab': mode === 'login' }"
              @click="mode = 'login'"
              >{{ $t('auth.login') }}</a
            >
          </li>
          <li>
            <a
              href="#"
              :class="{ 'active-tab': mode === 'register' }"
              @click="mode = 'register'"
              >{{ $t('auth.register') }}</a
            >
          </li>
        </ul>

        <form-login v-if="mode === 'login'"></form-login>
        <form-register v-else @closeModal="toggleAuthModal"></form-register>
      </section>
    </dialog>
  </transition>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

import FormLogin from './FormLogin.vue';
import FormRegister from './FormRegister.vue';

export default {
  name: 'Auth',
  components: { FormLogin, FormRegister },

  data() {
    return {
      mode: 'login',
    };
  },
  computed: {
    ...mapState({
      authModalShown: state => state.auth.authModalShown,
    }),
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
  },
};
</script>

<style lang="scss">
.auth-enter-from {
  opacity: 0;
}
.auth-enter-active {
  transition: opacity 0.5;
}
.auth-leave-to {
  opacity: 0;
  transition: opacity 0.5s;
}
</style>
