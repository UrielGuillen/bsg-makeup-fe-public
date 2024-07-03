// eslint-disable-next-line @typescript-eslint/typedef
export const MOCK_AUTHENTICATION_SERVICE = {
  signInUser: jasmine.createSpy('signInUser'),
  signUpUser: jasmine.createSpy('signUpUser'),
  signOutUser: jasmine.createSpy('signOutUser'),
  getAuthToken: jasmine.createSpy('getAuthToken'),
  isTypeUser: jasmine.createSpy('isTypeUser'),
  getDataFromToken: jasmine.createSpy('getDataFromToken'),
  saveToken: jasmine.createSpy('saveToken'),
};
