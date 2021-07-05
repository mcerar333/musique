/* eslint-disable no-console */

import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch(err => {
  switch (err.code) {
    case 'failed-precondition':
      console.error(
        'Persistence failed. The app is already open in another browser tab.'
      );
      break;
    case 'unimplemented':
      console.error(
        'The browser is incompatible with the offline persistence implementation.'
      );
      break;
    default:
      console.error('Firebase persistence encountered an unknown error.');
  }
});

const dbUsers = db.collection('users');
const dbSongs = db.collection('songs');
const dbComments = db.collection('comments');

const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { auth, storage, db, dbUsers, dbSongs, dbComments, timestamp };
