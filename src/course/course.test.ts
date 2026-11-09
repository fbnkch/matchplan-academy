import { describe, expect, it } from 'vitest';
import { lessons as existingLessons } from '../content';
import type { Check, Lesson } from '../types';
import {
  advancedLessons,
  analysisLessons,
  dataLessons,
  newLessons,
  scoutingLessons,
  statisticsLessons,
} from './index';

const TRACK_IDS = ['data', 'analysis', 'statistics', 'scouting', 'advanced'] as const;
type TrackId = (typeof TRACK_IDS)[number];

const trackLessons: Record<TrackId, Lesson[]> = {
  data: dataLessons,
  analysis: analysisLessons,
  statistics: statisticsLessons,
  scouting: scoutingLessons,
  advanced: advancedLessons,
};

const allById = new Map<string, Lesson>(
  [...existingLessons, ...newLessons].map((lesson) => [lesson.id, lesson]),
);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const assertJsonValue = (value: unknown, path: string): void => {
  if (value === null) return;
  if (typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    expect(Number.isFinite(value), `${path} muss eine endliche Zahl sein`).toBe(true);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertJsonValue(item, `${path}[${index}]`));
    return;
  }
  throw new Error(`${path} ist kein JSON-fähiger Wert (${typeof value}).`);
};

const assertChecks = (checks: Check[], path: string): void => {
  expect(Array.isArray(checks), `${path} muss ein Array sein`).toBe(true);
  expect(checks.length, `${path} braucht mindestens eine Prüfung`).toBeGreaterThan(0);
  const labels = new Set<string>();
  checks.forEach((entry, index) => {
    expect(isNonEmptyString(entry.label), `${path}[${index}].label fehlt`).toBe(true);
    expect(isNonEmptyString(entry.expression), `${path}[${index}].expression fehlt`).toBe(true);
    expect(entry.expected, `${path}[${index}].expected fehlt`).not.toBeUndefined();
    expect(labels.has(entry.label), `${path}: doppeltes Label "${entry.label}"`).toBe(false);
    labels.add(entry.label);
    assertJsonValue(entry.expected, `${path}[${index}].expected`);
  });
};

describe('Kursteile 2–6: Struktur', () => {
  it('liefert genau fünf Tracks mit je acht Lektionen', () => {
    expect(Object.keys(trackLessons)).toEqual([...TRACK_IDS]);
    expect(newLessons).toHaveLength(40);
    for (const trackId of TRACK_IDS) {
      expect(
        trackLessons[trackId].length,
        `${trackId} braucht 7–10 Lektionen`,
      ).toBeGreaterThanOrEqual(7);
      expect(trackLessons[trackId].length, `${trackId} hat zu viele Lektionen`).toBeLessThanOrEqual(
        10,
      );
      for (const lesson of trackLessons[trackId]) {
        expect(lesson.trackId, `${lesson.id}: falscher Track`).toBe(trackId);
      }
    }
  });

  it('verwendet eindeutige IDs ohne Kollision mit den bestehenden Lektionen', () => {
    const existingIds = new Set(
      existingLessons.filter((lesson) => lesson.trackId === 'python').map((lesson) => lesson.id),
    );
    const seen = new Set<string>();
    for (const lesson of newLessons) {
      expect(seen.has(lesson.id), `doppelte ID: ${lesson.id}`).toBe(false);
      expect(existingIds.has(lesson.id), `ID kollidiert mit Track 1: ${lesson.id}`).toBe(false);
      expect(lesson.id).toMatch(/^[a-z0-9-]+$/);
      seen.add(lesson.id);
    }
    expect(seen.size).toBe(newLessons.length);
  });

  it('verknüpft jede Lektion mit auflösbaren Voraussetzungen ohne Zyklus', () => {
    for (const lesson of newLessons) {
      expect(Array.isArray(lesson.prerequisites), `${lesson.id}: prerequisites fehlen`).toBe(true);
      expect(lesson.prerequisites?.length, `${lesson.id}: prerequisites sind leer`).toBeGreaterThan(
        0,
      );
      for (const prerequisite of lesson.prerequisites ?? []) {
        expect(
          allById.has(prerequisite),
          `${lesson.id}: unbekannte Voraussetzung ${prerequisite}`,
        ).toBe(true);
        expect(prerequisite, `${lesson.id}: verweist auf sich selbst`).not.toBe(lesson.id);
      }
    }

    const state = new Map<string, 'active' | 'done'>();
    const visit = (id: string): void => {
      const current = state.get(id);
      if (current === 'done') return;
      expect(current, `Zyklus in den Voraussetzungen bei ${id}`).not.toBe('active');
      state.set(id, 'active');
      for (const prerequisite of allById.get(id)?.prerequisites ?? []) visit(prerequisite);
      state.set(id, 'done');
    };
    for (const lesson of newLessons) visit(lesson.id);
  });

  it('schließt jeden Track an den vorherigen Lernpfad an', () => {
    const firstLessons = TRACK_IDS.map((trackId) => trackLessons[trackId][0]);
    for (const [index, first] of firstLessons.entries()) {
      const prerequisite = first.prerequisites?.[0] ?? '';
      if (index === 0) {
        expect(prerequisite, 'Track data muss an Track 1 anschließen').toBe('transfer');
      } else {
        const previousTrack = TRACK_IDS[index - 1];
        const previousIds = new Set(trackLessons[previousTrack].map((lesson) => lesson.id));
        expect(
          previousIds.has(prerequisite),
          `${first.id}: Voraussetzung liegt nicht im Vortrack`,
        ).toBe(true);
      }
    }
  });
});

describe('Kursteile 2–6: Lektionsinhalt', () => {
  it.each(newLessons.map((lesson) => [lesson.id, lesson] as const))(
    '%s hat vollständige Lernmaterialien',
    (_id, lesson) => {
      expect(isNonEmptyString(lesson.title)).toBe(true);
      expect(isNonEmptyString(lesson.concept)).toBe(true);
      expect(isNonEmptyString(lesson.objective)).toBe(true);
      expect(isNonEmptyString(lesson.task)).toBe(true);
      expect(isNonEmptyString(lesson.example)).toBe(true);
      expect(isNonEmptyString(lesson.reflection)).toBe(true);
      expect(lesson.minutes).toBeGreaterThanOrEqual(10);
      expect(lesson.minutes).toBeLessThanOrEqual(90);
      expect(lesson.explanation.length, 'Erklärung braucht 2–4 Absätze').toBeGreaterThanOrEqual(2);
      expect(lesson.explanation.length, 'Erklärung hat zu viele Absätze').toBeLessThanOrEqual(4);
      for (const paragraph of lesson.explanation) {
        expect(isNonEmptyString(paragraph)).toBe(true);
        expect(paragraph.length).toBeGreaterThan(80);
      }
      expect(lesson.hints.length, 'mindestens drei Hinweise').toBeGreaterThanOrEqual(3);
      for (const hint of lesson.hints) expect(isNonEmptyString(hint)).toBe(true);
      expect(lesson.rubric.length, 'mindestens zwei Rubrikpunkte').toBeGreaterThanOrEqual(2);
      for (const item of lesson.rubric) expect(isNonEmptyString(item)).toBe(true);
    },
  );

  it.each(newLessons.map((lesson) => [lesson.id, lesson] as const))(
    '%s prüft mit echten, JSON-fähigen Checks',
    (_id, lesson) => {
      expect(lesson.checks.length, 'mindestens zwei Prüfungen').toBeGreaterThanOrEqual(2);
      assertChecks(lesson.checks, `${lesson.id}.checks`);
    },
  );

  it.each(newLessons.map((lesson) => [lesson.id, lesson] as const))(
    '%s hat eine unvollständige Vorlage und eine andere Lösung',
    (_id, lesson) => {
      expect(isNonEmptyString(lesson.starter)).toBe(true);
      expect(isNonEmptyString(lesson.solution)).toBe(true);
      expect(lesson.starter.trim()).not.toBe(lesson.solution.trim());
      expect(lesson.starter.length).toBeLessThan(lesson.solution.length + 200);
    },
  );

  it.each(newLessons.map((lesson) => [lesson.id, lesson] as const))(
    '%s nennt erreichbare Primärquellen',
    (_id, lesson) => {
      expect(lesson.sources?.length, 'mindestens eine Quelle').toBeGreaterThanOrEqual(1);
      for (const source of lesson.sources ?? []) {
        expect(isNonEmptyString(source.title)).toBe(true);
        expect(source.url).toMatch(/^https:\/\/[^\s]+$/);
      }
    },
  );

  it.each(newLessons.map((lesson) => [lesson.id, lesson] as const))(
    '%s liefert funktionierende Varianten',
    (_id, lesson) => {
      if (!lesson.variants) return;
      expect(lesson.variants.length).toBeGreaterThan(0);
      const labels = new Set<string>();
      for (const variant of lesson.variants) {
        expect(isNonEmptyString(variant.label)).toBe(true);
        expect(labels.has(variant.label), `${lesson.id}: doppelte Variantenbezeichnung`).toBe(
          false,
        );
        labels.add(variant.label);
        expect(isNonEmptyString(variant.setup), `${lesson.id}/${variant.label}: Setup fehlt`).toBe(
          true,
        );
        assertChecks(variant.checks, `${lesson.id}.variants[${variant.label}]`);
      }
    },
  );
});

describe('Kursteile 2–6: Wiederholungen', () => {
  const reviewLessons = newLessons.filter((lesson) => lesson.reviewOf !== undefined);

  it('enthält genau eine Wiederholung pro Track', () => {
    expect(reviewLessons).toHaveLength(TRACK_IDS.length);
    for (const trackId of TRACK_IDS) {
      const reviews = trackLessons[trackId].filter((lesson) => lesson.reviewOf !== undefined);
      expect(reviews, `${trackId} braucht genau eine Wiederholung`).toHaveLength(1);
      const lessonsInTrack = trackLessons[trackId];
      expect(
        lessonsInTrack[lessonsInTrack.length - 1],
        `${trackId}: Wiederholung muss am Ende stehen`,
      ).toBe(reviews[0]);
    }
  });

  it('verweist auf eine existierende, andere Lektion', () => {
    for (const review of reviewLessons) {
      const targetId = review.reviewOf ?? '';
      const target = allById.get(targetId);
      expect(target, `${review.id}: reviewOf ${targetId} existiert nicht`).toBeDefined();
      expect(targetId).not.toBe(review.id);
      expect(review.solution.trim()).not.toBe(target?.solution.trim());
      expect(review.solution.trim()).not.toBe(target?.starter.trim());
    }
  });

  it('wiederholt eine Lektion aus demselben Track', () => {
    for (const review of reviewLessons) {
      const target = allById.get(review.reviewOf ?? '');
      expect(target?.trackId, `${review.id}: Ziel liegt in einem anderen Track`).toBe(
        review.trackId,
      );
    }
  });
});

describe('Kursteile 2–6: SQL-Vertrag', () => {
  const sqlLessons = newLessons.filter((lesson) => lesson.language === 'sql');

  it('markiert alle SQL-Lektionen mit Sprache, Paket und Setup', () => {
    expect(sqlLessons.length).toBeGreaterThanOrEqual(6);
    for (const lesson of sqlLessons) {
      expect(lesson.packages, `${lesson.id}: sqlite3-Paket fehlt`).toContain('sqlite3');
      expect(isNonEmptyString(lesson.setup), `${lesson.id}: Setup fehlt`).toBe(true);
      expect(lesson.setup ?? '').toMatch(/conn\s*=\s*sqlite3\.connect\(/);
      expect(lesson.solution.trim()).toMatch(/^SELECT|^WITH/i);
    }
  });

  it('lässt die Lernenden ein SELECT schreiben statt result zu setzen', () => {
    for (const lesson of sqlLessons) {
      expect(lesson.language).toBe('sql');
      expect(lesson.starter).not.toMatch(/^\s*result\s*=/m);
      expect(lesson.solution).not.toMatch(/^\s*result\s*=/m);
      for (const entry of lesson.checks) {
        expect(
          entry.expression,
          `${lesson.id}: Checks dürfen result nicht selbst definieren`,
        ).not.toMatch(/\bresult\s*=/);
      }
      for (const variant of lesson.variants ?? []) {
        expect(variant.setup).toMatch(/conn\s*=\s*sqlite3\.connect\(/);
        for (const entry of variant.checks) {
          expect(entry.expression).not.toMatch(/\bresult\s*=/);
        }
      }
    }
  });

  it('nutzt result nur in SQL-Lektionen als Prüfgröße', () => {
    for (const lesson of newLessons) {
      const usesResult = lesson.checks.some((entry) => /\bresult\b/.test(entry.expression));
      if (usesResult) expect(lesson.language, `${lesson.id}: result ohne SQL-Sprache`).toBe('sql');
    }
  });
});

describe('Kursteile 2–6: didaktische Leitplanken', () => {
  it('behauptet keine statistische Evidenz aus den fiktiven Daten', () => {
    const suspicious = /(beweist|belegt|signifikant|statistisch gesichert)/i;
    for (const lesson of newLessons) {
      expect(suspicious.test(lesson.example), `${lesson.id}: Beispiel behauptet Evidenz`).toBe(
        false,
      );
      expect(suspicious.test(lesson.task), `${lesson.id}: Aufgabe behauptet Evidenz`).toBe(false);
    }
  });

  it('setzt keine Platzhalter oder unfertigen TODO-Texte ein', () => {
    for (const lesson of newLessons) {
      const text = [
        lesson.title,
        lesson.concept,
        lesson.task,
        lesson.example,
        lesson.reflection,
        ...lesson.explanation,
        ...lesson.hints,
      ].join('\n');
      expect(text, `${lesson.id}: TODO gefunden`).not.toMatch(/\bTODO\b|\bFIXME\b|\bPlatzhalter\b/);
      expect(text, `${lesson.id}: Lorem ipsum gefunden`).not.toMatch(/lorem ipsum/i);
    }
  });

  it('beschreibt jede Lektion in einem eigenen, nachvollziehbaren Beispiel', () => {
    for (const lesson of newLessons) {
      expect(
        lesson.example.trim().split('\n').length,
        `${lesson.id}: Beispiel ist zu knapp`,
      ).toBeGreaterThanOrEqual(2);
      expect(lesson.example.length, `${lesson.id}: Beispiel ist zu knapp`).toBeGreaterThan(30);
    }
  });
});

describe('Kursteile 2–6: korrigierte Modellannahmen', () => {
  const lessonById = (id: string): Lesson => {
    const lesson = allById.get(id);
    expect(lesson, `${id} fehlt`).toBeDefined();
    return lesson as Lesson;
  };

  it('stat-logistik leitet Distanz und Winkel aus Schusskoordinaten ab', () => {
    const lesson = lessonById('stat-logistik');
    expect(lesson.setup ?? '').toMatch(/def shot_geometry\(x, y\)/);
    expect(lesson.setup ?? '').toContain('*shot_geometry(x, y)');
    expect(lesson.setup ?? '').toContain('columns=["match", "distance", "angle", "goal"]');
    expect(lesson.setup ?? '').toContain('("A", 108, 40, 1)');
    const expressions = lesson.checks.map((entry) => entry.expression).join('\n');
    expect(expressions).not.toMatch(/coef_/);
    expect(expressions).toContain('test_probs');
    expect(lesson.explanation.join(' ')).toMatch(/Koeffizienten/);
    expect(lesson.explanation.join(' ')).toMatch(/instabil/i);
  });

  it('analyse-richtung verwendet absolute Feldkoordinaten und spiegelt sie nachvollziehbar', () => {
    const lesson = lessonById('analyse-richtung');
    const events = JSON.parse((lesson.setup ?? '').replace(/^events = /, '')) as Array<{
      team: string;
      type: string;
      x: number;
      y: number;
      attacks: string;
    }>;
    const shots = events.filter((event) => event.type === 'Shot');
    expect(shots.length).toBeGreaterThan(0);
    for (const shot of shots) {
      if (shot.attacks === 'left')
        expect(shot.x, `${shot.team}: Schuss liegt nicht in der linken Hälfte`).toBeLessThan(60);
      else
        expect(shot.x, `${shot.team}: Schuss liegt nicht in der rechten Hälfte`).toBeGreaterThan(
          60,
        );
    }
    const normalized = shots.map((shot) =>
      shot.attacks === 'left'
        ? [shot.team, 120 - shot.x, 80 - shot.y]
        : [shot.team, shot.x, shot.y],
    );
    expect(normalized.slice(0, 5)).toEqual(lesson.checks[0].expected);
    expect(lesson.explanation[0]).toMatch(/absolut/i);
    expect(lesson.explanation[0]).toMatch(/0 \(linkes Tor\)/);
  });

  it('stat-leakage trennt ergebnisabgeleitetes Merkmal von echtem Anbieter-xG', () => {
    const lesson = lessonById('stat-leakage');
    const text = [
      lesson.example,
      lesson.task,
      lesson.solution,
      lesson.setup ?? '',
      ...lesson.explanation,
    ].join('\n');
    expect(text).toContain('goal_derived_xg_pct');
    expect(text).not.toMatch(/provider_xg/);
    expect(lesson.setup ?? '').toContain('("A", 12, 30, 4, 0)');
    expect(lesson.explanation.join(' ')).toMatch(/Anbieter-xG/);
    expect(lesson.explanation.join(' ')).toMatch(/vor dem Schuss/);
  });

  it('deklariert shots in den SQL-Setups als unvollständigen Ausschnitt', () => {
    const shotSetups = newLessons
      .filter((lesson) => lesson.language === 'sql')
      .map((lesson) => lesson.setup ?? '')
      .filter((setup) => setup.includes('CREATE TABLE shots'));
    expect(shotSetups.length).toBeGreaterThanOrEqual(2);
    for (const setup of shotSetups) {
      expect(setup).toContain('nur einen bewusst ausgewählten Ausschnitt');
      expect(setup).toMatch(/nicht im Ausschnitt/);
      expect(setup).toMatch(/nicht "null Ereignisse"/);
    }
    for (const id of ['sql-group', 'sql-join']) {
      expect(lessonById(id).explanation.join(' '), `${id}: Ausschnitt-Hinweis fehlt`).toMatch(
        /Ausschnitt/,
      );
    }
  });

  it('adv-pitch-control mittelt den Einfluss pro Team statt zu summieren', () => {
    const lesson = lessonById('adv-pitch-control');
    expect(lesson.solution).toContain('np.exp(-d / tau).mean(axis=1)');
    expect(lesson.solution).not.toMatch(/\.sum\(axis=1\)/);
    expect(lesson.objective).toMatch(/exponentiell abfallendem Distanzeinfluss/);
    expect(lesson.objective).not.toMatch(/invers/i);
    const symmetric = lesson.variants?.find((variant) => variant.label.includes('gleich nahe'));
    expect(symmetric, 'Symmetrievariante fehlt').toBeDefined();
    expect(symmetric?.checks[0].expected).toEqual([0.5]);
  });

  it('scout-composite rankt ausschließlich innerhalb einer Rolle', () => {
    const lesson = lessonById('scout-composite');
    expect(lesson.solution).toContain('players["position"] == "MF"');
    expect(lesson.solution).not.toMatch(/groupby\("position"\)/);
    expect(lesson.example).toContain('players["position"] == "MF"');
    expect(
      lesson.checks.some((entry) => entry.expression.includes('comp["position"] == "MF"')),
    ).toBe(true);
    const scores = lesson.checks.find((entry) => entry.label.includes('Top 5'))
      ?.expected as unknown[][];
    expect(scores).toHaveLength(5);
    expect(scores.every((row) => row[1] === 'MF')).toBe(true);
  });
});
