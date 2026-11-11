import { expect, it } from 'vitest';
import { unzipSync, strFromU8 } from 'fflate';
import { emptyProgress } from './progress';
import {
  projects,
  getProjectProgress,
  isProjectComplete,
  exportProject,
  getCompletion,
} from './projects';
it('verlangt Codeprüfung, eigene Ausarbeitung und Selbstprüfung statt nur Häkchen', () => {
  const p = emptyProgress(),
    project = projects[0];
  p.projects = {
    [project.id]: {
      ...getProjectProgress(p, project.id),
      milestones: project.milestones.map((m) => m.id),
      reviewed: true,
    },
  };
  p.lessons[project.lesson.id] = {
    code: project.lesson.solution,
    hintLevel: 0,
    solutionViewed: false,
    passed: true,
    reflection: '',
  };
  expect(isProjectComplete(project, p)).toBe(false);
  p.projects[project.id].report =
    'Unsere konkrete Fußballfrage ist die Verteilung der Abschlüsse. Die Stichprobe ist klein und wir können daraus weder Qualität noch stabile Mannschaftsmuster ableiten.';
  expect(isProjectComplete(project, p)).toBe(true);
  expect(getCompletion(p).completedProjects).toBe(1);
});
it('exportiert ausführbaren Code, Daten, Briefing und eigenen Bericht in einer ZIP', () => {
  const p = emptyProgress(),
    project = projects[0];
  p.projects = {
    [project.id]: { ...getProjectProgress(p, project.id), report: 'Eigener Bericht' },
  };
  p.lessons[project.lesson.id] = {
    code: '# mein Code',
    hintLevel: 0,
    solutionViewed: false,
    passed: false,
    reflection: '',
  };
  const archive = exportProject(project, p);
  const files = unzipSync(archive.data);
  expect(archive.name).toMatch(/\.zip$/);
  expect(strFromU8(files['analyse.py'])).toContain('# mein Code');
  expect(strFromU8(files['BERICHT.md'])).toBe('Eigener Bericht');
  expect(files['README.md']).toBeDefined();
  expect(Object.keys(files).some((name) => name.endsWith('.csv'))).toBe(true);
});
it('exportiert den festgelegten Datensatz auch bei anderem Projektnamen und zusätzlichen CSVs', () => {
  const project = {
    ...projects[0],
    id: 'eigener-spielbericht',
    analysisData: { fileName: 'data/events.csv', variableName: 'events' },
    files: [{ name: 'notes.csv', content: 'note\nZusatzdatei\n' }, ...projects[0].files],
  };
  const files = unzipSync(exportProject(project, emptyProgress()).data);
  expect(strFromU8(files['analyse.py'])).toContain(
    'events = pd.read_csv(Path(__file__).parent / "data/events.csv")',
  );
  expect(files['notes.csv']).toBeDefined();
  expect(files['data/events.csv']).toBeDefined();
});
