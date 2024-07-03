// eslint-disable-next-line @typescript-eslint/typedef
export const MOCK_NOTIFICATION_CENTRE_SERVICE = {
  getNotifications: jasmine.createSpy('getNotifications'),
  saveUserToken: jasmine.createSpy('saveUserToken'),
  removeUserToken: jasmine.createSpy('removeUserToken'),
  setNewNotifications: jasmine.createSpy('setNewNotifications'),
  getNewNotifications: jasmine.createSpy('getNewNotifications'),
};
