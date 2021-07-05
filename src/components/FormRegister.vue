<template>
  <div v-if="formFeedback" class="form-message" :class="formMessageType">
    {{ formMessage }}
  </div>

  <vee-form
    class="form form--auth"
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="register"
  >
    <label for="name" class="form__label">{{ $t('auth.name') }}</label>
    <VeeField type="text" name="name" class="form__input" />
    <ErrorMessage name="name" class="form-error" />

    <label for="email" class="form__label">{{ $t('auth.email') }}</label>
    <VeeField type="email" name="email" class="form__input" />
    <ErrorMessage name="email" class="form-error" />

    <label for="age" class="form__label">{{ $t('auth.age') }}</label>
    <VeeField type="number" name="age" class="form__input" />
    <ErrorMessage name="age" class="form-error" />

    <label for="password" class="form__label">{{ $t('auth.password') }}</label>
    <VeeField type="password" name="password" class="form__input" />
    <ErrorMessage name="password" class="form-error" />

    <label for="confirm" class="form__label">{{ $t('auth.confirm') }}</label>
    <VeeField type="password" name="confirm" class="form__input" />
    <ErrorMessage name="confirm" class="form-error" />

    <label for="country" class="form__label">{{ $t('auth.country') }}</label>
    <vee-field as="select" name="country" class="form__select">
      <option value="USA">USA</option>
      <option value="Slovenija">Slovenija</option>
      <option value="Belarus">Belarus</option>
    </vee-field>
    <ErrorMessage name="country" class="form-error" />

    <div class="form__tos">
      <VeeField type="checkbox" name="tos" value="1" />
      <label for="tos">{{ $t('auth.tos') }}</label>
    </div>
    <ErrorMessage name="tos" class="form-error form-error--tos" />

    <button
      class="btn"
      :class="{ 'btn--disabled': formSubmitDisabled }"
      :disabled="formSubmitDisabled"
    >
      {{ $t('auth.submit') }}
    </button>
  </vee-form>
</template>

<script>
import { mapMutations } from 'vuex';
import { getErrMsgAuth } from '@/includes/helpers';

export default {
  name: 'RegistrationForm',
  emits: ['closeModal'],

  data() {
    return {
      schema: {
        name: 'required|min:3|max:40|alpha_spaces',
        email: 'required|min:5|max:60|email',
        age: 'required|integer|min_age:18|max_age:123',

        password: {
          required: true,
          min: 8,
          max: 100,
          password_regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/,
        },

        confirm: 'passwords_mismatch:@password',
        country: 'required|excluded_country:Belarus',
        tos: 'tos',
      },

      initialValues: {
        country: 'USA',
      },

      formError: null,
      formFeedback: false,
      formInSubmission: false,
      formSubmitDisabled: false,
    };
  },
  computed: {
    formMessage() {
      if (this.formError) return getErrMsgAuth(this.formError);

      return this.formInSubmission
        ? 'Your account is being created. Please wait.'
        : 'Success! Your account has been created.';
    },
    formMessageType() {
      if (this.formError) return 'form-message--error';

      return this.formInSubmission
        ? 'form-message--pending'
        : 'form-message--success';
    },
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),

    async register(formVals, { resetForm }) {
      this.formError = null;
      this.formFeedback = true;
      this.formInSubmission = true;
      this.formSubmitDisabled = true;

      try {
        await this.$store.dispatch('register', formVals);
      } catch (err) {
        this.formError = err.code;
        this.formSubmitDisabled = false;
        this.formInSubmission = false;
        return;
      }

      this.formInSubmission = false;

      setTimeout(() => {
        this.toggleAuthModal();
        this.formFeedback = false;
        this.formError = null;
        this.formSubmitDisabled = false;
        resetForm();
      }, 1000);
    },
  },
};
</script>
