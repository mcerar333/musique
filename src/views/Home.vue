<template>
  <article>
    <section class="greeting">
      <div class="greeting__info">
        <h1>{{ $t('home.title') }}</h1>
        <p>{{ $t('home.description') }}</p>
      </div>

      <figure class="greeting__photo">
        <img src="/assets/img/headphones.png" alt="music headphones" />
      </figure>
    </section>

    <section class="songs" v-scroll="handleScroll">
      <h2 class="heading-2">
        {{ $t('home.songs') }}
        <span class="heading-2__icon" v-svg="'icon-headphones'"></span>
      </h2>

      <p v-if="fetchError" class="mt-sm">
        {{ $t('home.error') }}
      </p>

      <p v-else-if="!songs.length" class="mt-sm">
        {{ $t('home.empty') }}
      </p>

      <transition-group v-else tag="ul" name="slide" appear class="songs__list">
        <SongItem v-for="song in songs" :key="song.docID" :song="song" />
      </transition-group>

      <transition name="fade">
        <div
          v-if="!endOfResults"
          class="songs__load"
          v-svg="'icon-chevron-with-circle-down'"
          @click="fetchMore"
        ></div>
      </transition>
    </section>
  </article>
</template>

<script>
import { dbSongs } from '@/includes/firebase';

import SongItem from '@/components/SongItem.vue';
import Scroll from '@/directives/scroll';

export default {
  name: 'Home',
  components: { SongItem },
  directives: { Scroll },

  data() {
    return {
      songs: [],
      lastDoc: null,
      fetchError: null,
      endOfResults: false,
      requestPending: false,
      numInitialFetch: 10,
      numFetchMore: 3,
    };
  },
  created() {
    this.initialFetch();
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;

      const bottomOfPage = scrollTop + innerHeight >= offsetHeight - 1;

      if (!bottomOfPage) return;
      this.fetchMore();
    },
    async getSongs(docRef) {
      const snapshot = await docRef.get();

      if (snapshot.empty) this.endOfResults = true;

      snapshot.forEach(doc => {
        const data = doc.data();

        this.songs.push({
          docID: doc.id,
          displayName: data.displayName,
          modifiedName: data.modifiedName,
          commentCount: data.commentCount,
        });
      });

      this.lastDoc = this.songs[this.songs.length - 1].docID;
    },
    async initialFetch() {
      this.requestPending = true;

      const docRef = dbSongs
        .orderBy('createdAt', 'desc')
        .limit(this.numInitialFetch);

      try {
        await this.getSongs(docRef);
      } catch (err) {
        this.fetchError = err.code;
      }

      this.requestPending = false;
    },
    async fetchMore() {
      if (this.requestPending) return;
      if (this.endOfResults) return;

      this.requestPending = true;

      try {
        const lastDoc = await dbSongs.doc(this.lastDoc).get();

        const docRef = dbSongs
          .orderBy('createdAt', 'desc')
          .startAfter(lastDoc)
          .limit(this.numFetchMore);

        await this.getSongs(docRef);
      } catch (err) {
        this.fetchError = err.code;
      }

      this.requestPending = false;
    },
  },
};
</script>

<style lang="scss">
.slide-enter-from {
  opacity: 0;
  transform: translateX(-3rem);
}
.slide-enter-active {
  transition: all 0.5s;
}
.slide-move {
  transition: all 0.5s;
}
.slide-leave-active {
  position: absolute;
  transition: opacity 0.5s;
}
.slide-leave-to {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.1s;
}
</style>
