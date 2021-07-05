import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

export default router => {
  router.beforeEach((_to, _from, next) => {
    NProgress.start();
    next();
  });

  router.afterEach(NProgress.done);
};
