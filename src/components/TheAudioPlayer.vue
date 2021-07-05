<template>
  <div class="player" :class="{ hidden: !currentSong.modifiedName }">
    <div class="player__info" :class="{ hidden: !currentSong.modifiedName }">
      <h5 class="heading-player">
        {{ currentSong.modifiedName?.replace('.mp3', '') }}
        <span>by {{ currentSong.displayName }}</span>
      </h5>

      <div class="progress">
        <div class="progress__time">{{ seek }}</div>

        <div class="progress__container" @click="updateSeek">
          <div :style="{ width: playerProgress }" class="progress__bar"></div>
        </div>

        <div class="progress__total">{{ duration }}</div>
      </div>
    </div>

    <div class="player__nav">
      <button
        class="player-btn"
        aria-label="back to start"
        v-svg="'icon-controller-jump-to-start'"
        @click="seekToStart"
      ></button>

      <button
        class="player-btn"
        aria-label="back ten seconds"
        v-svg="'icon-controller-fast-backward'"
        @click="seekBack(10)"
      ></button>

      <button
        v-show="!audioIsPlaying"
        class="player-btn"
        aria-label="play"
        v-svg="'icon-controller-play'"
        @click="toggleAudio"
      ></button>

      <button
        v-show="audioIsPlaying"
        class="player-btn"
        aria-label="pause"
        v-svg="'icon-controller-paus'"
        @click="toggleAudio"
      ></button>

      <div class="player__volume">
        <label for="volume">{{ $t('player.volume') }} {{ volume }}%</label>
        <input
          type="range"
          name="volume"
          min="0"
          max="100"
          class="form__range"
          v-model="volume"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  name: 'AudioPlayer',

  data() {
    return {
      volume: 50,
    };
  },
  computed: {
    ...mapState({
      seek: state => state.player.seek,
      duration: state => state.player.duration,
      playerProgress: state => state.player.playerProgress,
      currentSong: state => state.player.currentSong,
    }),
    ...mapGetters(['audioIsPlaying']),
  },
  watch: {
    volume(newVal) {
      if (newVal < 0 || newVal > 100) return;
      this.setVolume(newVal / 100);
    },
  },
  methods: {
    ...mapActions([
      'toggleAudio',
      'updateSeek',
      'seekBack',
      'seekToStart',
      'setVolume',
    ]),
  },
};
</script>
