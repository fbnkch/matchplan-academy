import { expect, test } from 'vitest';
import { studyChapters, referenceSources } from './course-study';
import { lessons, tracks } from './content';
import { projects } from './projects';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

test('every theory chapter leads to existing exercises, courses and projects', () => {
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

test('the reference curriculum covers all thirteen requested repositories and retains optional specializations', () => {
  const requested = [
    'ossu/data-science',
    'data-folks/data-science-learning-path',
    'maarthala/data-engineering-lab',
    'mtpa/sads',
    'matiasmascioto/awesome-soccer-analytics',
    'patchy631/ai-engineering-hub',
    'Matre5/Football_Video_Analysis',
    'mrdbourke/zero-to-mastery-ml',
    'AdilShamim8/AI-Engineering',
    'AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects',
    'AdilShamim8/100-AI-Machine-Learning-Deep-Learnin-Projects',
    'eugeneyan/applied-ml',
    'codecrafters-io/build-your-own-x',
  ];
  for (const repository of requested)
    expect(
      referenceSources.some((source) =>
        source.url.toLowerCase().includes(repository.toLowerCase()),
      ),
      repository,
    ).toBe(true);
  expect(new Set(studyChapters.map((chapter) => chapter.id)).size).toBe(studyChapters.length);
  expect(studyChapters.find((chapter) => chapter.id === 'study-video')?.optional).toBe(true);
  expect(studyChapters.find((chapter) => chapter.id === 'study-ai')?.optional).toBe(true);
  for (const source of referenceSources) {
    expect(source.inspected.length, source.title).toBeGreaterThan(0);
    expect(source.license, source.title).toBeTruthy();
  }
});
