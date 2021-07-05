<template>
  <section class="manage">
    <ManageUpload @addSong="addSong" />

    <article class="manage__music">
      <h2 class="heading-2">
        {{ $t('manage.songs') }}
        <span class="heading-2__icon" v-svg="'icon-disk'"></span>
      </h2>

      <section class="music">
        <ManageSong
          v-for="song in songs"
          :key="song.docID"
          :song="song"
          @editSong="editSong"
          @removeSong="removeSong"
        />
      </section>
    </article>
  </section>
</template>

<script>
import { auth, dbSongs } from '@/includes/firebase';

import ManageUpload from '@/components/ManageUpload.vue';
import ManageSong from '@/components/ManageSong.vue';

export default {
  name: 'Manage',
  components: { ManageUpload, ManageSong },

  data() {
    return {
      songs: [],
    };
  },
  async created() {
    const snapshot = await dbSongs
      .where('uid', '==', auth.currentUser.uid)
      .orderBy('createdAt', 'desc')
      .get();

    snapshot.forEach(this.addSong);
  },
  methods: {
    addSong(doc) {
      const song = {
        docID: doc.id,
        ...doc.data(),
      };
      this.songs.push(song);
    },
    editSong(info) {
      const song = this.songs.find(s => s.docID === info.docID);
      song.modifiedName = info.modifiedName;
      song.genre = info.genre;
    },
    removeSong(docID) {
      const index = this.songs.findIndex(song => song.docID === docID);
      this.songs.splice(index, 1);
    },
  },
};
</script>
