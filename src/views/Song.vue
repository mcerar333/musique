<template>
  <article>
    <section class="track">
      <div class="track__info">
        <h1 v-if="songError">{{ songError }}</h1>
        <h1 v-else class="track__name">{{ songName }}</h1>

        <h2 class="track__genre">
          Genre: <span>{{ songGenre }}</span>
        </h2>
      </div>

      <button
        v-if="!songLoaded"
        class="btn--play"
        aria-label="load song"
        v-svg="'icon-controller-play'"
        @click="addNewSong(song), loadSong()"
      ></button>

      <BaseLottie v-else :options="lottieOptions" />
    </section>

    <section id="comments" class="comments">
      <h2 class="heading-2">
        {{ $tc('song.commentCount', commentCount, { n: commentCount }) }}
        <span class="heading-2__icon" v-svg="'icon-chat'"></span>
      </h2>

      <div class="comments__controls">
        <vee-form
          v-if="userLoggedIn"
          class="new-comment"
          :validation-schema="schema"
          @submit="addComment"
        >
          <vee-field
            as="textarea"
            name="comment"
            class="new-comment__message"
            :placeholder="$t('song.placeholder')"
          ></vee-field>
          <ErrorMessage name="comment" class="form-error" />

          <div
            v-if="formFeedback"
            class="form-message form-message--new-comment"
            :class="formMessageType"
          >
            {{ formMessage }}
          </div>

          <button
            type="submit"
            class="btn new-comment__submit"
            :class="{ 'btn--disabled': formSubmitDisabled }"
            :disabled="formSubmitDisabled"
          >
            {{ $t('song.submit') }}
          </button>
        </vee-form>

        <select
          name="sort"
          class="comments__sort"
          :class="{ 'comments__sort--solo': !userLoggedIn }"
          v-model="commentsOrder"
        >
          <option value="desc">{{ $t('song.latest') }}</option>
          <option value="asc">{{ $t('song.oldest') }}</option>
        </select>
      </div>

      <p v-if="commentsError" class="mt-sm-ng">{{ $t('song.error') }}</p>

      <p v-else-if="!sortedComments.length" class="mt-sm-ng">
        {{ $t('song.empty') }}
      </p>

      <template v-else>
        <div
          v-for="comment in sortedComments"
          :key="comment.docID"
          class="comment"
        >
          <h4 class="heading-4">{{ comment.userName }}</h4>
          <p class="comment__time">{{ comment.distanceToNow }}</p>
          <p class="comment__message">{{ comment.content }}</p>
        </div>
      </template>
    </section>
  </article>
</template>

<script>
import { auth, dbComments, dbSongs, timestamp } from '@/includes/firebase';
import { getErrMsgFirebase } from '@/includes/helpers';
import { formatDistanceToNow } from 'date-fns';
import { mapState, mapActions } from 'vuex';
import { defineAsyncComponent } from 'vue';

import * as animationData from '@/assets/lottie/movie.json';

const BaseLottie = defineAsyncComponent(() =>
  import('@/components/BaseLottie.vue')
);

export default {
  name: 'Song',
  components: { BaseLottie },

  data() {
    return {
      lottieOptions: { animationData },

      schema: {
        comment: 'required|min:3|max:100',
      },

      song: {},
      songError: null,
      songLoaded: false,

      comments: [],
      commentsError: null,
      commentsOrder: 'desc',

      formError: null,
      formFeedback: false,
      formInSubmission: false,
      formSubmitDisabled: false,
    };
  },
  computed: {
    ...mapState({
      userLoggedIn: state => state.auth.userLoggedIn,
    }),

    songName() {
      return this.song.modifiedName?.replace('.mp3', '') ?? 'Loading...';
    },
    songGenre() {
      return this.song.genre || 'unknown';
    },
    commentCount() {
      return this.song.commentCount ?? 0;
    },
    formattedComments() {
      return this.comments.map(comment => ({
        distanceToNow: formatDistanceToNow(comment.createdAt.toDate(), {
          addSuffix: true,
        }),
        ...comment,
      }));
    },
    sortedComments() {
      if (this.commentsOrder === 'desc')
        return this.formattedComments
          .slice(0)
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

      return this.formattedComments
        .slice(0)
        .sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate());
    },
    formMessage() {
      if (this.formError) return getErrMsgFirebase(this.formError);

      return this.formInSubmission
        ? 'Your comment is being submitted. Please wait a moment...'
        : 'Success! Your comment has been submitted.';
    },
    formMessageType() {
      if (this.formError) return 'form-message--error';

      return this.formInSubmission
        ? 'form-message--pending'
        : 'form-message--success';
    },
  },
  async created() {
    const { sort } = this.$route.query;
    this.commentsOrder = sort === 'asc' || sort === 'desc' ? sort : 'desc';

    try {
      const snapshot = await dbSongs.doc(this.$route.params.id).get();

      if (!snapshot.exists) {
        this.$router.replace({ name: 'NotFound' });
        throw Error('The song you are looking for does not exist.');
      }

      this.song = snapshot.data();
      this.getComments();
    } catch (err) {
      this.songError = err.message;
    }
  },
  watch: {
    commentsOrder(newVal) {
      if (newVal === this.$route.query.sort) return;

      this.$router.push({
        query: { sort: newVal },
      });
    },
  },
  methods: {
    ...mapActions(['addNewSong']),

    loadSong() {
      this.songLoaded = true;
    },
    async getComments() {
      this.commentsError = null;

      try {
        const snapshot = await dbComments
          .where('songID', '==', this.$route.params.id)
          .orderBy('createdAt', 'desc')
          .get();

        this.comments = [];

        snapshot.forEach(doc => {
          this.comments.push({
            docID: doc.id,
            ...doc.data(),
          });
        });
      } catch (err) {
        this.commentsError = err.code;
      }
    },
    async addComment(values, { resetForm }) {
      this.formError = null;
      this.formFeedback = true;
      this.formInSubmission = true;
      this.formSubmitDisabled = true;

      const comment = {
        content: values.comment,
        songID: this.$route.params.id,
        userName: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        createdAt: timestamp(),
      };

      try {
        await dbComments.add(comment);

        this.song.commentCount += 1;
        await dbSongs.doc(this.$route.params.id).update({
          commentCount: this.song.commentCount,
        });

        this.getComments();
      } catch (err) {
        this.formError = err.code;
        this.formSubmitDisabled = false;
        this.formInSubmission = false;
        return;
      }

      this.formInSubmission = false;

      setTimeout(() => {
        this.formFeedback = false;
        this.formError = null;
        this.formSubmitDisabled = false;
        resetForm();
      }, 1000);
    },
  },
};
</script>
