import { MinutesToHoursPipe } from './minutes-to-hours.pipe';

// eslint-disable-next-line @typescript-eslint/typedef
const MOCK_TRANSLATE_SERVICE = jasmine.createSpyObj(
  [ 'instant' ],
);

describe('MinutesToHoursPipe', () => {
  it('should create an instance', () => {
    const pipe: MinutesToHoursPipe = new MinutesToHoursPipe(MOCK_TRANSLATE_SERVICE);
    expect(pipe).toBeTruthy();
  });

  it('should transform the minutes into hours', () => {
    MOCK_TRANSLATE_SERVICE.instant.and.callFake(() => 'hrs.');

    const pipe: MinutesToHoursPipe = new MinutesToHoursPipe(MOCK_TRANSLATE_SERVICE);
    expect(pipe.transform(210)).toBe('3:30 hrs.');
  });

  it('should not transform the minutes into hours', () => {
    MOCK_TRANSLATE_SERVICE.instant.and.callFake(() => 'min.');

    const pipe: MinutesToHoursPipe = new MinutesToHoursPipe(MOCK_TRANSLATE_SERVICE);
    expect(pipe.transform(30)).toBe('30 min.');
  });
});
