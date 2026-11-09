import { beforeEach, describe, expect, it } from 'vitest';
import {
  emptyProgress,
  exportProgress,
  importProgress,
  loadProgress,
  saveProgress,
  getStatus,
} from './progress';
describe('Lernfortschritt über Sitzungen hinweg', () => {
  it('bewahrt Theorie-Notizen und Lesemarkierungen unabhängig von Codeprüfungen', () => {
    const p = {
      ...emptyProgress(),
      study: { notes: { 'study-data': 'Ein Match fehlt im Feed.' }, completed: ['study-data'] },
    };
    expect(importProgress(exportProgress(p))).toEqual(p);
    expect(loadProgress().lessons).toEqual({});
    const invalid = { ...p, study: { notes: { 'study-data': 4 }, completed: [] } };
    expect(() => importProgress(JSON.stringify(invalid))).toThrow();
  });
  beforeEach(() => localStorage.clear());
  it('bewahrt Code, Hilfen und Reflexion beim Speichern und Export/Import', () => {
    const p = emptyProgress();
    p.lessons['anpfiff'] = {
      code: 'print(3)',
      hintLevel: 1,
      solutionViewed: false,
      passed: true,
      reflection: 'Kleine Stichprobe',
    };
    expect(saveProgress(p)).toBe(true);
    expect(loadProgress()).toEqual(p);
    expect(importProgress(exportProgress(p))).toEqual(p);
  });
  it('weist beschädigte oder fremde Backups zurück, ohne vorhandene Daten zu überschreiben', () => {
    const p = emptyProgress();
    saveProgress(p);
    for (const input of [
      'null',
      '{}',
      '{"version":2,"lessons":{}}',
      '{"version":1,"selectedLesson":"anpfiff","lessons":{"anpfiff":{"passed":"yes"}}}',
    ])
      expect(() => importProgress(input)).toThrow();
    expect(loadProgress()).toEqual(p);
  });
  it('bestätigt Hilfe nicht als selbstständig beherrscht', () => {
    expect(
      getStatus({ code: '', hintLevel: 1, solutionViewed: false, passed: true, reflection: '' }),
    ).toBe('Mit Hilfe geübt');
    expect(
      getStatus({ code: '', hintLevel: 0, solutionViewed: false, passed: true, reflection: '' }),
    ).toBe('Selbstständig gelöst');
  });
  it('überschreibt unlesbaren Browserfortschritt erst nach ausdrücklicher Wiederherstellung', () => {
    localStorage.setItem('matchplan-academy-v1', '{"version":1,"lessons":');
    const p = loadProgress();
    expect(saveProgress(p)).toBe(false);
    expect(localStorage.getItem('matchplan-academy-v1')).toBe('{"version":1,"lessons":');
  });
  it('speichert keine Eingaben, die beim nächsten Laden als ungültig gelten würden', () => {
    const original = emptyProgress();
    saveProgress(original);
    const oversized = emptyProgress();
    oversized.lessons.anpfiff = {
      code: 'x'.repeat(100001),
      reflection: '',
      passed: false,
      hintLevel: 0,
      solutionViewed: false,
    };
    expect(saveProgress(oversized)).toBe(false);
    expect(loadProgress()).toEqual(original);
  });
  it('sichert Projektberichte und Meilensteine und liest ältere Backups weiter', () => {
    const p = emptyProgress();
    p.projects = {
      spielbericht: {
        report: 'Unsere Fragestellung und Grenzen',
        notes: 'Video prüfen',
        milestones: ['question'],
        reviewed: true,
      },
    };
    expect(importProgress(exportProgress(p))).toEqual(p);
    expect(importProgress(exportProgress(emptyProgress())).projects).toBeUndefined();
    const invalid = JSON.parse(exportProgress(p));
    invalid.projects.spielbericht.reviewed = 'ja';
    expect(() => importProgress(JSON.stringify(invalid))).toThrow();
  });
  it('kann einen umfangreichen vollständigen Kurs als Backup wieder einlesen', () => {
    const p = emptyProgress();
    for (let i = 0; i < 50; i++)
      p.lessons['lesson-' + i] = {
        code: 'x'.repeat(45000),
        reflection: 'Notiz',
        hintLevel: 0,
        solutionViewed: false,
        passed: false,
      };
    const exported = exportProgress(p);
    expect(exported.length).toBeGreaterThan(2000000);
    expect(Object.keys(importProgress(exported).lessons)).toHaveLength(50);
  });
});
