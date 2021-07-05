<template>
  <div class="new-song">
    <div class="new-song__controls">
      <h3 class="heading-3">{{ songName }}</h3>

      <button class="btn" v-svg="'icon-edit'" @click="toggleShowForm"></button>
      <button class="btn" v-svg="'icon-trash'" @click="removeSong"></button>
    </div>

    <vee-form
      v-show="formShown"
      :validation-schema="schema"
      :initial-values="initialValues"
      class="form"
      @submit="editSong"
    >
      <label for="title" class="form__label">{{ $t('manage.title') }}</label>
      <VeeField
        type="text"
        name="title"
        :placeholder="$t('manage.titlePlaceholder')"
        class="form__input"
      />
      <ErrorMessage name="title" class="form-error" />

      <label for="genre" class="form__label">{{ $t('manage.genre') }}</label>
      <VeeField
        type="text"
        name="genre"
        :placeholder="$t('manage.genrePlaceholder')"
        class="form__input"
      />
      <ErrorMessage name="genre" class="form-error" />

      <div
        v-if="formFeedback"
        class="form-message form-message--new-song"
        :class="formMessageType"
      >
        {{ formMessage }}
      </div>

      <div class="form__controls">
        <button
          type="submit"
          class="btn"
          :class="{ 'btn--disabled': formSubmitDisabled }"
          :disabled="formSubmitDisabled"
        >
          {{ $t('manage.submit') }}
        </button>

        <button
          type="button"
          class="btn btn--dark"
          :class="{ 'btn--disabled': formSubmitDisabled }"
          :disabled="formSubmitDisabled"
          @click="toggleShowForm"
        >
          {{ $t('manage.discard') }}
        </button>
      </div>
    </vee-form>
  </div>
</template>

<script>
import { auth, storage, dbSongs, timestamp } from '@/includes/firebase';
import { getErrMsgFirebase } from '@/includes/helpers';

export default {
  name: 'ManageSong',

  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  emits: ['editSong', 'removeSong'],

  data() {
    return {
      schema: {
        title: 'required|max:60',
        genre: 'max:30|alpha_spaces',
      },
      initialValues: {
        title: this.song.modifiedName.replace('.mp3', ''),
        genre: this.song.genre,
      },

      formShown: false,
      formError: null,
      formFeedback: false,
      formInSubmission: false,
      formSubmitDisabled: false,
    };
  },
  computed: {
    songName() {
      return this.song.modifiedName.replace('.mp3', '');
    },
    formMessage() {
      if (this.formError) return getErrMsgFirebase(this.formError, 'manage');

      return this.formInSubmission
        ? 'Updating song info. Please wait a moment...'
        : 'Success! Song info updated.';
    },
    formMessageType() {
      if (this.formError) return 'form-message--error';

      return this.formInSubmission
        ? 'form-message--pending'
        : 'form-message--success';
    },
  },
  methods: {
    toggleShowForm() {
      this.formShown = !this.formShown;
    },
    async editSong(values) {
      this.formError = null;
      this.formFeedback = true;
      this.formInSubmission = true;
      this.formSubmitDisabled = true;

      try {
        await dbSongs.doc(this.song.docID).update({
          modifiedName: values.title,
          genre: values.genre,
          lastModified: timestamp(),
        });
      } catch (err) {
        this.formError = err.code;
        this.formSubmitDisabled = false;
        this.formInSubmission = false;
        return;
      }

      this.$emit('editSong', {
        docID: this.song.docID,
        modifiedName: values.title,
        genre: values.genre,
      });

      this.formInSubmission = false;

      setTimeout(() => {
        this.formShown = false;
        this.formFeedback = false;
        this.formError = null;
        this.formSubmitDisabled = false;
      }, 1000);
    },
    async removeSong() {
      this.formError = null;
      this.formFeedback = false;

      const storageRef = storage.ref();
      const songRef = storageRef.child(
        `songs/${auth.currentUser.uid}/${this.song.originalName}`
      );

      try {
        await songRef.delete();
        await dbSongs.doc(this.song.docID).delete();
      } catch (err) {
        this.formError = err.code;
        this.formFeedback = true;
        this.formShown = true;
        return;
      }
      this.$emit('removeSong', this.song.docID);
    },
  },
};
</script>
