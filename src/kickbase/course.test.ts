import { describe, expect, it } from 'vitest';
import { strFromU8, unzipSync } from 'fflate';
import { lessons } from '../content';
import { studyChapters } from '../course-study';
import {
  allProjectSteps,
  exportKickbaseStarter,
  foundationSteps,
  kickbaseSteps,
  previewPlayers,
} from './course';
import { exportSeasonStarter } from './season-starter';

describe('Kickbase learning journey', () => {
  it('links project steps to available theory and practice', () => {
    for (const step of allProjectSteps) {
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
    for (const step of foundationSteps)
      expect(files[`${prefix}${step.folder}/README.md`], step.folder).toBeDefined();
    expect(strFromU8(files[prefix + 'exercises/metrics.py'])).toContain('NotImplementedError');
    expect(strFromU8(files[prefix + 'solutions/metrics.py'])).not.toContain('NotImplementedError');
    const csv = strFromU8(files[prefix + 'data/players.csv']);
    for (const player of previewPlayers)
      expect(csv).toContain(`${player.name},${player.role},${player.points},${player.marketValue}`);
    expect(strFromU8(files[prefix + 'README.md'])).toContain('synthetisch');
    expect(archive.name).toBe('Kickbase-Lernprojekt.zip');
  });

  it('delivers an IDE project with open learner code and a readable offline guide', () => {
    const archive = exportSeasonStarter();
    const files = unzipSync(archive.data);
    expect(archive.name).toBe('Saison-Dashboard.zip');
    expect(files['Saison-Dashboard/coach.py']).toBeDefined();
    expect(files['Saison-Dashboard/git_lab.py']).toBeDefined();
    expect(strFromU8(files['Saison-Dashboard/README.md'])).toContain(
      'Git parallel zum Projekt lernen',
    );
    expect(files['Saison-Dashboard/LICENSE']).toBeDefined();
    expect(strFromU8(files['Saison-Dashboard/src/season_dashboard/client.py'])).toContain(
      'raise NotImplementedError',
    );
    expect(strFromU8(files['Saison-Dashboard/LERNWEG.md'])).toContain('Vorhersage');
    for (const step of kickbaseSteps) {
      expect(
        Object.keys(files).some(
          (path) =>
            path === `Saison-Dashboard/${step.folder}` ||
            path.startsWith(`Saison-Dashboard/${step.folder}/`),
        ),
        step.folder,
      ).toBe(true);
    }
    expect(
      Object.keys(files).some((path) =>
        /private_data|__pycache__|\.pyc$|\.(?:sqlite|db)$|\/\.env$/.test(path),
      ),
    ).toBe(false);
  });
});
