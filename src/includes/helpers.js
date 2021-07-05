const formatTime = timeSec => {
  const min = String(Math.trunc(timeSec / 60) || 0).padStart(2, 0);
  const sec = String(Math.round(timeSec) % 60 || 0).padStart(2, 0);

  return `${min}:${sec}`;
};

const roundNumber = (num, decimals = 1) =>
  Math.round((num + Number.EPSILON) * decimals * 10) / decimals / 10;

const getErrMsgAuth = errCode => {
  let errMsg;
  switch (errCode) {
    case 'auth/invalid-email':
      errMsg = 'The email address is not valid.';
      break;

    case 'auth/email-already-in-use':
      errMsg = 'This email address is already in use by another account.';
      break;

    case 'auth/user-not-found':
      errMsg =
        'There is no user corresponding to this email address. Please verify your login credentials.';
      break;

    case 'auth/wrong-password':
      errMsg =
        'The password is incorrect. Please verify your login credentials.';
      break;

    case 'auth/weak-password':
      errMsg = 'The password is not strong enough.';
      break;

    case 'auth/user-disabled':
      errMsg =
        'The accound associated with this email address has been disabled.';
      break;

    case 'auth/network-request-failed':
      errMsg =
        'A network error has occured. Please check your internet connection or try again later.';
      break;

    default:
      errMsg = 'An unexpected error occured. Please try again later.';
  }
  return errMsg;
};

const getErrMsgFirebase = (errCode, type = 'upload') => {
  let errMsg;
  switch (errCode) {
    case 'unavailable':
      errMsg = 'Our servers are currently unavailable. Please try again later.';
      break;

    case 'storage/offline':
      errMsg = 'Internet connection lost.';
      break;

    case 'storage/wrong-file-type':
      errMsg = 'Unsupported file type.';
      break;

    case 'unauthenticated':
    case 'storage/unauthenticated':
      errMsg = 'Login required to perform this action.';
      break;

    case 'permission-denied':
    case 'storage/unauthorized':
      if (type === 'upload')
        errMsg = `Please verify the file type is an mp3 and it's size is not exceeding 10MB.`;
      if (type === 'manage')
        errMsg = 'Please wait at least 5 seconds between each edit.';
      else
        errMsg =
          'You do not have sufficient permissions to perform this action.';
      break;

    case 'storage/retry-limit-exceeded':
      errMsg = 'Retry limit exceeded. Please try again later.';
      break;

    case 'storage/invalid-checksum':
      errMsg = 'Invalid checksum. Please try again.';
      break;

    case 'storage/canceled':
      errMsg = 'Upload canceled by the user.';
      break;

    case 'storage/server-file-wrong-size':
      errMsg = 'File size mismatch. Please try again.';
      break;

    default:
      errMsg = 'An unexpected error occured. Please try again later.';
  }
  return errMsg;
};

export { formatTime, roundNumber, getErrMsgAuth, getErrMsgFirebase };
