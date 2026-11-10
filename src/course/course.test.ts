import { expect, test } from 'vitest';
import { lessons } from '../content';

test('lesson IDs and prerequisites form an unambiguous, navigable learning path', () => {
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  expect(byId.size).toBe(lessons.length);

  const visited = new Set<string>();
  const visiting = new Set<string>();
  function visit(id: string) {
    expect(visiting.has(id), `Prerequisite cycle at ${id}`).toBe(false);
    if (visited.has(id)) return;
    const lesson = byId.get(id);
    expect(lesson, `Missing prerequisite ${id}`).toBeDefined();
    if (!lesson) return;
    visiting.add(id);
    for (const prerequisite of lesson.prerequisites ?? []) visit(prerequisite);
    visiting.delete(id);
    visited.add(id);
  }
  for (const lesson of lessons) {
    visit(lesson.id);
    if (lesson.reviewOf)
      expect(byId.has(lesson.reviewOf), `Missing review target for ${lesson.id}`).toBe(true);
  }
});
