<template>
  <li class="song">
    <div class="song__info">
      <router-link :to="{ name: 'Song', params: { id: song.docID } }">{{
        songName
      }}</router-link>
      <p>{{ song.displayName }}</p>
    </div>

    <router-link
      :to="{ name: 'Song', params: { id: song.docID }, hash: '#comments' }"
      v-slot="{ navigate }"
      custom
    >
      <div class="song__comments" v-svg="'icon-chat'" @click="navigate">
        <span>{{ song.commentCount }}</span>
      </div>
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'SongItem',

  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  computed: {
    songName() {
      return this.song.modifiedName.replace('.mp3', '');
    },
  },
};
</script>
