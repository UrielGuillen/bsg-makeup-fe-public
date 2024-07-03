// eslint-disable-next-line @typescript-eslint/typedef
export const environment = {
  production: false,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('../../package.json').version,
  api: {
    url: 'http://localhost:8080/services/api/v1',
  },
  assets: {
    prefix: 'https://d32cgrjvmquyg3.cloudfront.net',
    icons: '/icons',
    translatePrefix: 'assets/i18n/',
  },
  profilePhotos: {
    url: 'https://djbj8rz76ju0.cloudfront.net/',
  },
  aws: {
    accessKey: '',
    secretKey: '',
    region: 'us-west-1',
    userPhotosBucket: 'bsg-makeup-user-photos',
    userPhotosFolder: 'profile-photos/',
  },
  gcp: {
    mapsApiKey: '',
  },
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    vapidKey: '',
  },
};
