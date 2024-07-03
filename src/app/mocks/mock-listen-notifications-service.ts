// eslint-disable-next-line @typescript-eslint/typedef
export const MOCK_LISTEN_NOTIFICATION_SERVICE = {
  requestPermission: jasmine.createSpy('requestPermission'),
  listen: jasmine.createSpy('listen'),
  removeListeners: jasmine.createSpy('removeListeners'),
};
