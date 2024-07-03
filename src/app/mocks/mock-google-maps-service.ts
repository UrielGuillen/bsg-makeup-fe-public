// eslint-disable-next-line @typescript-eslint/typedef
export const MOCK_GOOGLE_MAPS_SERVICE = {
  initMap: jasmine.createSpy('initMap').and.returnValue(Promise.resolve()),
  initCircle: jasmine.createSpy('initCircle'),
  getMapOptions: jasmine.createSpy('getMapOptions').and.returnValue({}),
  getMapCircleOptions: jasmine.createSpy('getMapCircleOptions').and.returnValue({}),
};
