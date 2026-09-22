import { getGreetingKey } from './greeting';

describe('getGreetingKey', () => {
  it.each([
    [5, 'home.greeting_morning'],
    [11, 'home.greeting_morning'],
    [12, 'home.greeting_afternoon'],
    [17, 'home.greeting_afternoon'],
    [18, 'home.greeting_evening'],
    [2, 'home.greeting_evening'],
  ])('maps hour %i to %s', (hour, key) => {
    expect(getGreetingKey(hour)).toBe(key);
  });
});
