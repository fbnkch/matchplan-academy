// @vitest-environment node
import { expect, test } from 'vitest';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import events from './datasets/practice-events.json';
import shots from './datasets/practice-shots.json';
import provenance from './datasets/provenance.json';

test('the public teaching snapshot is independently generated fictional data', () => {
  expect(provenance.provider).toBe('Matchplan synthetic teaching data');
  expect(provenance.revision).toBe('matchplan-synthetic-v1');
  expect(events).toHaveLength(6948);
  expect(shots).toHaveLength(255);
  expect(provenance.matches).toHaveLength(12);
  expect(events.every((event) => event.id.startsWith('mp-syn-'))).toBe(true);
  expect(shots.every((shot) => shot.event_id.startsWith('mp-syn-'))).toBe(true);
  expect(
    provenance.matches.every((match) => match.match_id >= 910001 && match.match_id <= 910012),
  ).toBe(true);
});

test('the generator reproduces the exact public bytes and recorded SHA-256 hashes', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'matchplan-synthetic-'));
  try {
    execFileSync('python', ['scripts/generate-teaching-data.py', '--output-dir', directory]);
    for (const name of ['practice-events.json', 'practice-shots.json', 'provenance.json']) {
      const committed = readFileSync(path.join('src/course/datasets', name));
      expect(readFileSync(path.join(directory, name)).equals(committed), name).toBe(true);
      if (name !== 'provenance.json') {
        expect(createHash('sha256').update(committed).digest('hex')).toBe(
          provenance.sha256[name as keyof typeof provenance.sha256],
        );
      }
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('match references, chronological date cohorts and unknown coverage stay explicit', () => {
  const matches = new Map(provenance.matches.map((match) => [match.match_id, match]));
  const dates = provenance.matches.map((match) => match.date);
  expect(dates).toEqual([...dates].sort());
  expect(new Set(dates).size).toBe(6);
  for (const date of new Set(dates))
    expect(dates.filter((value) => value === date)).toHaveLength(2);
  expect(new Set(events.map((event) => event.match_id)).size).toBe(2);
  for (const match of provenance.matches) {
    const rows = events.filter((event) => event.match_id === match.match_id);
    if (rows.length) {
      expect(match.events).toBe(3474);
      expect(rows).toHaveLength(3474);
      expect(rows.map((row) => row.index)).toEqual(
        Array.from({ length: 3474 }, (_, index) => index + 1),
      );
      expect(rows.filter((row) => row.type.name === 'Half End').map((row) => row.period)).toEqual([
        1, 2,
      ]);
    } else {
      expect(match.events).toBeNull();
      expect(match.event_coverage).toBe('not supplied');
    }
    expect(shots.filter((shot) => shot.match_id === match.match_id).length).toBeGreaterThan(0);
  }
  for (const shot of shots) {
    const match = matches.get(shot.match_id)!;
    expect(match).toBeDefined();
    expect(shot.match_date).toBe(match.date);
    expect([match.home, match.away]).toContain(shot.team);
    expect(shot.provider_xg).toBeGreaterThan(0);
    expect(shot.provider_xg).toBeLessThan(1);
  }
  expect(new Set(events.map((event) => event.id)).size).toBe(events.length);
  expect(new Set(shots.map((shot) => shot.event_id)).size).toBe(shots.length);
});

test('nested shots agree with the flat table and plausible geometry has overlapping outcomes', () => {
  const byId = new Map(shots.map((shot) => [shot.event_id, shot]));
  for (const event of events) {
    if (event.location) {
      expect(event.location[0]).toBeGreaterThanOrEqual(0);
      expect(event.location[0]).toBeLessThanOrEqual(120);
      expect(event.location[1]).toBeGreaterThanOrEqual(0);
      expect(event.location[1]).toBeLessThanOrEqual(80);
    }
    if (event.shot) {
      const shot = byId.get(event.id)!;
      expect(shot.match_id).toBe(event.match_id);
      expect(event.location).toEqual([shot.x, shot.y]);
      expect(event.shot.generated_xg).toBe(shot.provider_xg);
      expect(Number(event.shot.outcome.name === 'Goal')).toBe(shot.goal);
    }
  }
  for (const match of provenance.matches) {
    const rows = shots.filter((shot) => shot.match_id === match.match_id);
    expect(rows.some((shot) => shot.x > 110 && Math.abs(shot.y - 40) < 5 && shot.goal === 0)).toBe(
      true,
    );
    expect(rows.some((shot) => shot.x < 90 && shot.goal === 1)).toBe(true);
  }
});
