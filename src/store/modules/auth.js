import { auth, dbUsers } from '@/includes/firebase';

export default {
  state: {
    authModalShown: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: state => {
      state.authModalShown = !state.authModalShown;
    },
    toggleAuthState: state => {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  actions: {
    initAuth: ({ commit }) => {
      const user = auth.currentUser;
      if (user) commit('toggleAuthState');
    },
    login: async ({ commit }, payload) => {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);
      commit('toggleAuthState');
    },
    logout: async ({ commit }) => {
      await auth.signOut();
      commit('toggleAuthState');
    },
    register: async ({ commit }, payload) => {
      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      );

      await dbUsers.doc(userCred.user.uid).set({
        age: +payload.age,
        name: payload.name,
        email: payload.email,
        country: payload.country,
      });

      await userCred.user.updateProfile({ displayName: payload.name });
      commit('toggleAuthState');
    },
  },
};
