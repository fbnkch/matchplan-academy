import { expect, test } from 'vitest';
import { engineeringLessons } from './engineering';
import { lessons } from '../content';

test('engineering practice prepares a complete pipeline rather than isolated calculations', () => {
  expect(engineeringLessons).toHaveLength(8);
  for (const lesson of engineeringLessons) {
    expect(
      lesson.checks.length + (lesson.variants ?? []).reduce((n, v) => n + v.checks.length, 0),
    ).toBeGreaterThanOrEqual(4);
    expect(lesson.hints).toHaveLength(3);
    expect(lesson.solution).not.toEqual(lesson.starter);
    expect(lesson.minutes).toBeGreaterThanOrEqual(60);
    expect(lesson.sources?.length).toBeGreaterThanOrEqual(2);
    for (const id of lesson.prerequisites ?? [])
      expect(lessons.some((l) => l.id === id)).toBe(true);
  }
});
