type GreetingKey =
  | 'home.greeting_morning'
  | 'home.greeting_afternoon'
  | 'home.greeting_evening';

export function getGreetingKey(hour: number): GreetingKey {
  if (hour >= 5 && hour <= 11) return 'home.greeting_morning';
  if (hour >= 12 && hour <= 17) return 'home.greeting_afternoon';
  return 'home.greeting_evening';
}
