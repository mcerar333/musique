import { createI18n } from 'vue-i18n';

const loadLocaleMessages = () => {
  const messages = {};

  const locales = require.context(
    '../locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );

  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default ?? locales(key);
    }
  });

  return messages;
};

const customRule = choice => {
  switch (choice) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
    case 4:
      return 3;
    default:
      return 4;
  }
};

export default createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  pluralizationRules: {
    sl: customRule,
  },
});
