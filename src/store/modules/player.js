import { formatTime, roundNumber } from '@/includes/helpers';
import { Howl } from 'howler';

export default {
  state: {
    currentSong: {},
    audio: {},
    volume: 0.5,
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  getters: {
    audioIsPlaying: state => {
      if (state.audio.playing) return state.audio.playing();
      return false;
    },
  },
  mutations: {
    addNewSong: (state, payload) => {
      state.currentSong = payload;

      state.audio = new Howl({
        volume: state.volume,
        src: [payload.url],
        html5: true,
      });
    },
    setVolume: (state, volume) => {
      state.audio.volume(volume);
      state.volume = volume;
    },
    updateAudioPosition: state => {
      state.seek = formatTime(state.audio.seek());
      state.duration = formatTime(state.audio.duration());

      state.playerProgress = `${roundNumber(
        (state.audio.seek() / state.audio.duration()) * 100
      )}%`;
    },
  },
  actions: {
    addNewSong: ({ state, commit, dispatch }, payload) => {
      if (state.audio instanceof Howl) state.audio.unload();

      commit('addNewSong', payload);
      state.audio.play();

      state.audio.on('play', () =>
        requestAnimationFrame(() => dispatch('audioProgress'))
      );
    },
    audioProgress: ({ state, commit, dispatch }) => {
      commit('updateAudioPosition');

      if (!state.audio.playing()) return;

      requestAnimationFrame(() => dispatch('audioProgress'));
    },
    toggleAudio: ({ state }) => {
      if (!state.audio.playing) return;

      if (state.audio.playing()) {
        state.audio.pause();
        return;
      }

      state.audio.play();
    },
    updateSeek: ({ state, dispatch }, e) => {
      if (!state.audio.playing) return;

      const { x, width } = e.currentTarget.getBoundingClientRect();

      const fraction = (e.clientX - x) / width;
      const seconds = Math.round(state.audio.duration() * fraction);

      state.audio.seek(seconds);
      state.audio.once('seek', () => dispatch('audioProgress'));
    },
    seekBack: ({ state, dispatch }, sec) => {
      if (!state.audio.playing) return;

      const timestamp = Math.round(state.audio.seek() - sec);

      if (timestamp <= 0) state.audio.seek(0);
      else state.audio.seek(timestamp);

      state.audio.once('seek', () => dispatch('audioProgress'));
    },
    seekToStart: ({ state, dispatch }) => {
      if (!state.audio.playing) return;

      state.audio.seek(0);
      state.audio.once('seek', () => dispatch('audioProgress'));
    },
    setVolume: ({ state, commit }, volume) => {
      if (!state.audio.playing) return;
      commit('setVolume', volume);
    },
  },
};
