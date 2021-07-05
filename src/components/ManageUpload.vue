<template>
  <aside class="manage__upload">
    <h2 class="heading-2">
      {{ $t('manage.upload') }}
      <span class="heading-2__icon" v-svg="'icon-upload'"></span>
    </h2>

    <div class="upload">
      <div
        class="upload__area"
        :class="{ active: isDraggedOver }"
        @drag.stop.prevent=""
        @dragstart.stop.prevent=""
        @dragenter.stop.prevent="isDraggedOver = true"
        @dragover.stop.prevent="isDraggedOver = true"
        @dragleave.stop.prevent="isDraggedOver = false"
        @dragend.stop.prevent="isDraggedOver = false"
        @drop.stop.prevent="upload"
      >
        {{ $t('manage.drop') }}
      </div>

      <input
        type="file"
        name="file-input"
        multiple
        id="file-input"
        class="file__input"
        @change="upload"
      />
      <label for="file-input" class="file__label" v-svg="'icon-upload'">
        <span>{{ $t('manage.select') }}</span>
      </label>

      <div
        v-for="upload in uploads"
        :key="upload.uniqueName"
        class="upload__bar"
      >
        <h5 v-if="upload.error" class="heading-5">{{ upload.message }}</h5>
        <h5 v-else-if="upload.status === 'success'" class="heading-5">
          {{ $t('manage.finished') }}
        </h5>
        <h5 v-else class="heading-5">{{ upload.name }}</h5>

        <div class="upload__bar__background">
          <span
            :style="{ width: upload.progress + '%' }"
            class="upload__bar__progress"
            :class="{
              'upload__bar__progress--error': upload.status === 'error',
              'upload__bar__progress--success': upload.status === 'success',
              'upload__bar__progress--complete': upload.status !== 'running',
            }"
          ></span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { auth, storage, dbSongs, timestamp } from '@/includes/firebase';
import { getErrMsgFirebase } from '@/includes/helpers';

export default {
  name: 'UploadSong',

  data() {
    return {
      isDraggedOver: false,
      uploads: [],
    };
  },
  beforeUnmount() {
    this.uploads.forEach(upload => upload.task.cancel?.());
  },
  methods: {
    upload(e) {
      this.isDraggedOver = false;

      const files = e.dataTransfer
        ? [...e.dataTransfer.files]
        : [...e.target.files];

      files.forEach(file => {
        if (file.type !== 'audio/mpeg') {
          this.rejectUpload(file, 'storage/wrong-file-type');
          return;
        }
        if (!navigator.onLine) {
          this.rejectUpload(file, 'storage/offline');
          return;
        }

        const uniqueName = this.getUniqueName(file.name);

        const storageRef = storage.ref();
        const songsRef = storageRef.child(
          `songs/${auth.currentUser.uid}/${uniqueName}`
        );
        const task = songsRef.put(file);

        const uploadIndex =
          this.uploads.push({
            task,
            name: file.name,
            uniqueName,
            progress: 0,
            status: 'running',
            error: null,
            message: '',
          }) - 1;

        task.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            this.uploads[uploadIndex].progress = progress;
          },
          err => {
            this.uploads[uploadIndex].message = getErrMsgFirebase(err.code);
            this.uploads[uploadIndex].status = task.snapshot.state;
            this.uploads[uploadIndex].error = err.code;
          },
          async () => {
            const song = {
              displayName: auth.currentUser.displayName,
              originalName: task.snapshot.ref.name,
              modifiedName: file.name,
              genre: '',
              commentCount: 0,
              uid: auth.currentUser.uid,
              createdAt: timestamp(),
              lastModified: timestamp(),
            };

            try {
              song.url = await task.snapshot.ref.getDownloadURL();

              const songRef = await dbSongs.add(song);
              const songSnapshot = await songRef.get();
              this.$emit('addSong', songSnapshot);

              this.uploads[uploadIndex].status = task.snapshot.state;
            } catch (err) {
              this.uploads[uploadIndex].message = getErrMsgFirebase(err.code);
              this.uploads[uploadIndex].error = err.code;
            }
          }
        );
      });
    },
    rejectUpload(file, errCode) {
      this.uploads.push({
        task: {},
        name: file.name,
        progress: 100,
        status: 'error',
        error: errCode,
        message: getErrMsgFirebase(errCode),
        uniqueName: this.getUniqueName(file.name),
      });
    },
    getUniqueName(name) {
      const uid =
        Date.now().toString(36) +
        Math.random()
          .toString(36)
          .slice(2);
      return `${uid}_${name}`;
    },
  },
};
</script>
