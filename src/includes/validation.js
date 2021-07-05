import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from 'vee-validate';

import {
  min,
  max,
  email,
  regex,
  integer,
  required,
  confirmed,
  min_value as minValue,
  max_value as maxValue,
  not_one_of as excluded,
  alpha_spaces as alphaSpaces,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('min', min);
    defineRule('max', max);
    defineRule('email', email);
    defineRule('integer', integer);
    defineRule('alpha_spaces', alphaSpaces);

    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('min_age', minValue);
    defineRule('max_age', maxValue);

    defineRule('password_regex', regex);
    defineRule('passwords_mismatch', confirmed);

    defineRule('tos', required);
    defineRule('required', required);

    defineRule('excluded', excluded);
    defineRule('excluded_country', excluded);

    configure({
      generateMessage: ctx => {
        const messages = {
          min: `The ${ctx.field} is too short.`,
          max: `The ${ctx.field} is too long.`,
          email: `Please provide a valid email address.`,
          integer: `The ${ctx.field} must be an integer.`,
          alpha_spaces: `The ${ctx.field} may only contain alphabetic characters and spaces.`,

          min_value: `The ${ctx.field} is too low.`,
          max_value: `The ${ctx.field} is too high.`,
          min_age: `You have to be at least 18 years old in order to use our services.`,
          max_age: `The oldest person ever whose age has been independently verified is Jeanne Calment of France, who lived to the age of 122 years, 164 days.`,

          excluded: `You are not allowed to use this value for ${ctx.field}.`,
          excluded_country: `Due to legal restrictions, we can't accept users from this location.`,

          required: `The ${ctx.field} is required.`,
          tos: `Before continuing, you must accept our Terms of Service.`,

          password_regex: `Password should contain at least one uppercase letter, one lowercase letter, one number and be between 8 and 100 characters long.`,
          passwords_mismatch: `The passwords don't match.`,
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The ${ctx.field} field is invalid.`;

        return message;
      },
    });
  },
};
