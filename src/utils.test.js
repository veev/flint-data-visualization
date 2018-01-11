import { map_range } from './utils'

test('move large numbers to 0 to 100', () => {
  expect(map_range(650, 500, 1000, 0, 100)).toBe(30);
});