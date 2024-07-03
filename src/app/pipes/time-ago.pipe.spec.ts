import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  it('create an instance', () => {
    const pipe: TimeAgoPipe = new TimeAgoPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a formated date', () => {
    const pipe: TimeAgoPipe = new TimeAgoPipe();
    const mockDate: number = new Date('2024-01-01T08:30').getTime();

    expect(pipe.transform(mockDate)).toBe('01 Jan 24 08:30');
  });
});
