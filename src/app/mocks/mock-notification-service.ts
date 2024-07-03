// eslint-disable-next-line @typescript-eslint/typedef
export const MOCK_NOTIFICATION_SERVICE = {
  showToast: jasmine.createSpy('showToast'),
  showNotification: jasmine.createSpy('showNotification'),
  confirm: jasmine.createSpy('confirm'),
};
