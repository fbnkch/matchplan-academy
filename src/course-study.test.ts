import { expect, test } from 'vitest';
import { studyChapters } from './course-study';
import { lessons, tracks } from './content';
import { projects } from './projects';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

test('every theory chapter leads to existing exercises, courses and projects', () => {
  expect(new Set(studyChapters.map((chapter) => chapter.id)).size).toBe(studyChapters.length);
  for (const chapter of studyChapters) {
    expect(
      tracks.some((track) => track.id === chapter.trackId),
      chapter.id,
    ).toBe(true);
    for (const id of chapter.practiceIds)
      expect(
        lessons.some((lesson) => lesson.id === id),
        id,
      ).toBe(true);
    if (chapter.projectId)
      expect(
        projects.some((project) => project.id === chapter.projectId),
        chapter.projectId,
      ).toBe(true);
  }
});

test('local IDE references point to folders supplied with the learning platform', () => {
  for (const chapter of studyChapters)
    for (const project of chapter.localProjects ?? []) {
      expect(project.path.startsWith('Beispielprojekte/')).toBe(true);
      expect(existsSync(resolve(project.path)), project.path).toBe(true);
    }
});
