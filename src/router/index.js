import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import store from '@/store/index';

const routes = [
  {
    name: 'Home',
    path: '/',
    component: Home,
  },
  {
    name: 'About',
    path: '/about',
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
  {
    name: 'Manage',
    path: '/manage-music',
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "manage" */ '@/views/Manage.vue'),
  },
  {
    path: '/manage',
    redirect: { name: 'Manage' },
  },
  {
    name: 'Song',
    path: '/song/:id',
    component: () => import(/* webpackChunkName: "song" */ '@/views/Song.vue'),
  },
  {
    name: 'NotFound',
    path: '/:catchAll(.*)*',
    component: () =>
      import(/* webpackChunkName: "notFound" */ '@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkExactActiveClass: 'e-active',
  linkActiveClass: 'l-active',
  routes,

  scrollBehavior(to, _from, currentPosition) {
    if (to.query.sort) return currentPosition;

    if (to.hash)
      return new Promise(resolve =>
        setTimeout(
          () => resolve({ el: to.hash, top: 20, behavior: 'smooth' }),
          1000
        )
      );

    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  if (to.matched.every(record => !record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.auth.userLoggedIn) {
    next();
    return;
  }

  next({ name: 'Home' });
});

export default router;
