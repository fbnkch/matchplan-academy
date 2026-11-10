import { describe, expect, it } from 'vitest';
import { strFromU8, unzipSync } from 'fflate';
import { lessons } from '../content';
import { studyChapters } from '../course-study';
import { exportKickbaseStarter, kickbaseSteps, previewPlayers } from './course';

describe('Kickbase learning journey', () => {
  it('links project steps to available theory and practice', () => {
    for (const step of kickbaseSteps) {
      expect(studyChapters.some((chapter) => chapter.id === step.studyChapterId)).toBe(true);
      for (const id of step.practiceIds)
        expect(lessons.some((lesson) => lesson.id === id)).toBe(true);
    }
  });
  it('packages runnable sources, separate solutions and fictional CSV without caches', () => {
    const archive = exportKickbaseStarter();
    const files = unzipSync(archive.data);
    const prefix = 'Kickbase-Lernprojekt/';
    for (const name of [
      'app.py',
      'metrics.py',
      'README.md',
      'LICENSE',
      'tests/test_reference.py',
      'exercises/metrics.py',
      'solutions/metrics.py',
      'data/players.csv',
    ])
      expect(files[prefix + name], name).toBeDefined();
    expect(Object.keys(files).some((name) => /__pycache__|\.pyc$|node_modules/.test(name))).toBe(
      false,
    );
    for (const step of kickbaseSteps)
      expect(files[`${prefix}${step.folder}/README.md`], step.folder).toBeDefined();
    expect(strFromU8(files[prefix + 'exercises/metrics.py'])).toContain('NotImplementedError');
    expect(strFromU8(files[prefix + 'solutions/metrics.py'])).not.toContain('NotImplementedError');
    const csv = strFromU8(files[prefix + 'data/players.csv']);
    for (const player of previewPlayers)
      expect(csv).toContain(`${player.name},${player.role},${player.points},${player.marketValue}`);
    expect(strFromU8(files[prefix + 'README.md'])).toContain('synthetisch');
    expect(archive.name).toBe('Kickbase-Lernprojekt.zip');
  });
});
