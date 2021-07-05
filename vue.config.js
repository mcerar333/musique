module.exports = {
  css: {
    sourceMap: true,
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      fullInstall: true,
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
    },
  },
  pwa: {
    name: 'Musique',
    themeColor: '#ea2e63',
    msTileColor: '#ea2e63',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',

    manifestOptions: {
      lang: 'en-US',
      start_url: '.',
      short_name: 'Musique',
      display: 'standalone',
      background_color: '#ff7559',
      orientation: 'portrait-primary',
      description:
        'Musique connects global music industry talent on one platform.',

      icons: [
        {
          src: './img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: './img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: './img/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/apple-touch-icon-60x60.png',
          sizes: '60x60',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon-76x76.png',
          sizes: '76x76',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon-120x120.png',
          sizes: '120x120',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon-152x152.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon-180x180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: './img/icons/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: './img/icons/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: './img/icons/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: './img/icons/msapplication-icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: './img/icons/mstile-150x150.png',
          sizes: '150x150',
          type: 'image/png',
        },
      ],
    },
  },
};
