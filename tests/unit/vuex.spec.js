import { createStore } from 'vuex';
import { cloneDeep } from 'lodash';

import player from '@/store/modules/player';
import auth from '@/store/modules/auth';

jest.mock('@/includes/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
  },
}));

describe('Vuex Store', () => {
  test('audioIsPlaying returns true if audio is playing', () => {
    const state = {
      audio: {
        playing: () => true,
      },
    };

    const result = player.getters.audioIsPlaying(state);
    expect(result).toBe(true);
  });

  test('toggleAuthModal mutation sets authModalShown state to true', () => {
    const clonedAuth = cloneDeep(auth);

    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });

    expect(store.state.auth.authModalShown).not.toBe(true);

    store.commit('toggleAuthModal');

    expect(store.state.auth.authModalShown).toBe(true);
  });

  test('toggleAuthState mutation sets userLoggedIn state to true', () => {
    const clonedAuth = cloneDeep(auth);

    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });

    expect(store.state.auth.userLoggedIn).not.toBe(true);

    store.commit('toggleAuthState');

    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  test('login action sets userLoggedIn state to true', async () => {
    expect.assertions(2);

    const clonedAuth = cloneDeep(auth);

    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });

    expect(store.state.authuserLoggedIn).not.toBe(true);

    await store.dispatch('login', {
      email: 'test@example.com',
      password: '123abcDEF',
    });

    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  test('logout action sets userLoggedIn state to false', async () => {
    expect.assertions(1);

    const clonedAuth = cloneDeep(auth);

    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });

    store.state.auth.userLoggedIn = true;

    await store.dispatch('logout');
    expect(store.state.auth.userLoggedIn).toBe(false);
  });
});
