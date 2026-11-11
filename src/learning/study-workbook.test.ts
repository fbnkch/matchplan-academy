import { expect, test } from 'vitest';
import { unzipSync, strFromU8 } from 'fflate';
import { exportStudyWorkbook } from './study-workbook';
import type { StudyChapter } from '../course-study';

test('a chapter workbook includes the teaching text, worked example, acceptance criteria and learner notes', () => {
  const chapter: StudyChapter = {
    id: 'study-demo',
    trackId: 'python',
    title: 'Minuten prüfen',
    lead: 'Eine eigene Auswertung',
    sections: [
      {
        title: 'Die Rechnung',
        paragraphs: ['Jede Zeile beschreibt einen Einsatz.'],
        example: {
          code: 'print(270 / 90)',
          expected: '3.0',
          explanation: '270 Minuten entsprechen drei vollen Spielen.',
        },
        diagram: {
          title: 'Ein Git-Ablauf',
          url: '/diagrams/git-working-tree.html',
          summary: 'Vom Bearbeiten zum gespeicherten Stand.',
          steps: ['Den Index vor dem Commit prüfen.'],
        },
        selfCheck: {
          question: 'Welche Fassung wird gespeichert?',
          answer: 'Die ausgewählte Fassung im Index.',
        },
      },
    ],
    questions: ['Was fehlt?'],
    build: {
      title: 'Lokale Aufgabe',
      url: 'https://example.org',
      brief: 'Ändere die Minuten.',
      acceptance: ['Die leere Liste funktioniert.'],
    },
    media: [],
    practiceIds: [],
  };
  const archive = exportStudyWorkbook(chapter, 'Meine Frage');
  const files = unzipSync(archive.data);
  expect(strFromU8(files['LEITFADEN.md'])).toContain('Jede Zeile beschreibt einen Einsatz.');
  expect(strFromU8(files['LEITFADEN.md'])).toContain('Die leere Liste funktioniert.');
  expect(strFromU8(files['beispiel-01.txt'])).toContain('print(270 / 90)');
  expect(strFromU8(files['beispiel-01.txt'])).toContain('3.0');
  expect(strFromU8(files['NOTIZEN.md'])).toBe('Meine Frage');
  expect(strFromU8(files['LEITFADEN.md'])).toContain('Den Index vor dem Commit prüfen.');
  expect(strFromU8(files['LEITFADEN.md'])).toContain('Die ausgewählte Fassung im Index.');
});
