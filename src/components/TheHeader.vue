<template>
  <header class="header">
    <router-link :to="{ name: 'Home' }" class="header__logo">
      Musique
    </router-link>

    <nav class="header__controls">
      <ul class="nav">
        <li v-if="!userLoggedIn" class="nav__item">
          <a href="#" class="nav__link" @click="toggleAuthModal">{{
            $t('header.login')
          }}</a>
        </li>

        <template v-else>
          <li class="nav__item">
            <a href="#" class="nav__link" @click="logout">{{
              $t('header.logout')
            }}</a>
          </li>

          <li class="nav__item">
            <router-link :to="{ name: 'Manage' }" class="nav__link">
              {{ $t('header.manage') }}
            </router-link>
          </li>
        </template>

        <li class="nav__item">
          <router-link :to="{ name: 'About' }" class="nav__link">
            {{ $t('header.about') }}
          </router-link>
        </li>
      </ul>

      <button class="nav__lang btn" @click="toggleLocale">
        {{ activeLocale }}
      </button>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'Header',

  computed: {
    ...mapState({
      userLoggedIn: state => state.auth.userLoggedIn,
    }),

    activeLocale() {
      return this.$i18n.locale === 'sl' ? 'Sl' : 'En';
    },
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),

    logout() {
      this.$store.dispatch('logout');
      if (this.$route.meta.requiresAuth) this.$router.replace({ name: 'Home' });
    },
    toggleLocale() {
      this.$i18n.locale = this.$i18n.locale === 'sl' ? 'en' : 'sl';
    },
  },
};
</script>
