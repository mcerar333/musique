<template>
  <div v-if="formFeedback" class="form-message" :class="formMessageType">
    {{ formMessage }}
  </div>

  <vee-form class="form form--auth" :validation-schema="schema" @submit="login">
    <label for="email" class="form__label">{{ $t('auth.email') }}</label>
    <VeeField type="email" name="email" class="form__input" />
    <ErrorMessage name="email" class="form-error" />

    <label for="password" class="form__label">{{ $t('auth.password') }}</label>
    <VeeField type="password" name="password" class="form__input" />
    <ErrorMessage name="password" class="form-error" />

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
  name: 'LoginForm',
  emits: ['closeModal'],

  data() {
    return {
      schema: {
        email: 'required|min:5|max:60|email',

        password: {
          required: true,
          min: 8,
          max: 100,
          password_regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/,
        },
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
        ? 'We are logging you in. Please wait.'
        : 'Success! Your are now logged in.';
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

    async login(formVals, { resetForm }) {
      this.formError = null;
      this.formFeedback = true;
      this.formInSubmission = true;
      this.formSubmitDisabled = true;

      try {
        await this.$store.dispatch('login', formVals);
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
