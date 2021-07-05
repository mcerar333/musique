import { createApp } from 'vue';
import { auth } from './includes/firebase';

import router from './router';
import store from './store';
import App from './App.vue';

// Styles
import './assets/sass/main.scss';

// Plugins
import i18n from './includes/i18n';
import VeeValidatePlugin from './includes/validation';

// Directives
import Svg from './directives/svg';

// Progress Bar
import progressBar from './includes/progressBar';

// Service Worker
import './registerServiceWorker';

progressBar(router);

let app;
auth.onAuthStateChanged(() => {
  if (app) return;

  app = createApp(App);

  app.use(i18n);
  app.use(store);
  app.use(router);
  app.use(VeeValidatePlugin);

  app.directive('svg', Svg);

  app.mount('#app');
});
