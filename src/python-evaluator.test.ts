// @vitest-environment node
import { beforeAll, expect, it } from 'vitest';
import { loadPyodide, type PyodideAPI } from 'pyodide';
import { evaluateSubmission } from './python-evaluator';
import { lessons } from './content';
import { projects } from './projects';
import { createRequire } from 'node:module';
import path from 'node:path';
import { unzipSync, strFromU8 } from 'fflate';
import { exportProject } from './projects';
import { emptyProgress } from './progress';
import { SQL_BASE_SETUP, SQL_ALT_SETUP } from './course/fixtures';
import { studyChapters } from './course-study';
let python: PyodideAPI;
beforeAll(async () => {
  const root = path.dirname(createRequire(import.meta.url).resolve('pyodide/package.json'));
  python = await loadPyodide({ indexURL: root, packageCacheDir: path.resolve('public/pyodide') });
  await python.loadPackage(['numpy', 'pandas', 'scikit-learn', 'matplotlib'], {
    messageCallback: () => {},
  });
  python.runPython('import matplotlib; matplotlib.use("agg")');
}, 120000);
it.each(
  studyChapters.flatMap((chapter) =>
    chapter.sections.flatMap((section) =>
      section.example && section.example.language !== 'shell'
        ? [{ chapter: chapter.id, title: section.title, ...section.example }]
        : [],
    ),
  ),
)(
  'Referenzbeispiel im Browser-Python: $chapter / $title',
  (example) => {
    const result = evaluateSubmission(python, example.code, {
      checks: [
        {
          label: 'Dokumentierte Ausgabe',
          source: 'stdout',
          expression: '',
          expected: example.expected,
        },
      ],
    });
    expect(result.error, example.title).toBeUndefined();
    expect(result.checks[0]?.passed, `${example.title}: ${result.output}`).toBe(true);
  },
  30000,
);
it.each([...lessons, ...projects.map((p) => p.lesson)])(
  'echte Python-/SQL-Auswertung: $id',
  (lesson) => {
    const result = evaluateSubmission(python, lesson.solution, lesson);
    expect(result.error, lesson.id).toBeUndefined();
    expect(result.checks.length).toBeGreaterThan(0);
    expect(
      result.checks.filter((c) => !c.passed),
      lesson.id,
    ).toEqual([]);
  },
  30000,
);
it('erkennt fest eingetragene Ergebnisse und fehlende Textausgabe', () => {
  for (const [id, code] of [
    ['spielzeit', 'full_matches = 6'],
    ['profil', 'minutes = 810; player_name = "Mira"'],
    ['vergleich', 'eligible = False'],
    ['schleife', 'total = 270'],
    ['rollenfilter', 'shortlist = ["Ada", "Nora"]'],
    ['anpfiff', 'team = "Nordstadt"'],
  ]) {
    const lesson = lessons.find((l) => l.id === id)!;
    const result = evaluateSubmission(python, code, lesson);
    expect(
      result.checks.some((c) => !c.passed),
      id,
    ).toBe(true);
  }
});
it.each(lessons)(
  'Startercode verlangt eigene Arbeit: $id',
  (lesson) => {
    const result = evaluateSubmission(python, lesson.starter, lesson);
    expect(!!result.error || result.checks.some((c) => !c.passed), lesson.id).toBe(true);
  },
  30000,
);
it.each(projects)(
  'Exportierte Python-Datei läuft mit ihren CSV-Dateien: $id',
  (project) => {
    const p = emptyProgress();
    p.lessons[project.lesson.id] = {
      code: project.lesson.solution,
      passed: true,
      solutionViewed: false,
      hintLevel: 0,
      reflection: '',
    };
    const files = unzipSync(exportProject(project, p).data),
      directory = '/export-test-' + project.id;
    python.FS.mkdirTree(directory + '/data');
    for (const [name, bytes] of Object.entries(files))
      if (name.endsWith('.csv')) python.FS.writeFile(directory + '/' + name, bytes);
    const source =
      `__file__ = ${JSON.stringify(directory + '/analyse.py')}\n` + strFromU8(files['analyse.py']);
    const result = evaluateSubmission(python, source, { ...project.lesson, setup: '' });
    expect(result.error, project.id).toBeUndefined();
    expect(result.checks.filter((c) => !c.passed)).toEqual([]);
    expect(python.FS.readdir(directory).some((name: string) => name.endsWith('.png'))).toBe(true);
    if (files['app.py'])
      python.runPython(`compile(${JSON.stringify(strFromU8(files['app.py']))}, 'app.py', 'exec')`);
  },
  30000,
);
it('erkennt Leakage im xG-Projekt und akzeptiert korrekte Listen als Vorhersagen', () => {
  const project = projects.find((p) => p.id === 'xg-modell')!;
  const leaked = project.lesson.solution.replace(
    'model.fit(train[features], train["goal"])',
    'model.fit(shots[features], shots["goal"])',
  );
  expect(evaluateSubmission(python, leaked, project.lesson).checks.some((c) => !c.passed)).toBe(
    true,
  );
  const asList = project.lesson.solution + '\npredictions = predictions.tolist()';
  expect(
    evaluateSubmission(python, asList, project.lesson).checks.filter((c) => !c.passed),
  ).toEqual([]);
});
it('prüft erwartete Ausnahmen und weist eine fehlende Ausnahme zurück', () => {
  const lesson = {
    checks: [
      {
        label: 'Ungültige Koordinate',
        expression: 'bounded(-1)',
        raises: 'ValueError',
        expected: null,
      },
    ],
  };
  expect(
    evaluateSubmission(python, 'def bounded(x):\n    raise ValueError("Außerhalb")', lesson)
      .checks[0].passed,
  ).toBe(true);
  expect(evaluateSubmission(python, 'def bounded(x):\n    return 0', lesson).checks[0].passed).toBe(
    false,
  );
});
it('begrenzt auch eine einzelne sehr große print-Ausgabe', () => {
  const result = evaluateSubmission(python, 'team = "Nordstadt"\nprint("x" * 100000)', lessons[0]);
  expect(result.error).toContain('64 KB');
  expect(result.output.length).toBeLessThanOrEqual(64000);
  expect(result.checks.every((c) => c.actual.length <= 64000)).toBe(true);
});
it('hält SQL-Datenverträge zwischen Spielen, Schüssen und Einsatzzeiten ein', () => {
  const queries = [
    'SELECT s.shot_id FROM shots s JOIN matches m ON m.match_id=s.match_id WHERE s.team NOT IN (m.home,m.away)',
    'SELECT player_id,match_id FROM appearances GROUP BY player_id,match_id HAVING COUNT(*) > 1',
    'SELECT p.name FROM players p JOIN appearances a ON p.player_id=a.player_id GROUP BY p.player_id HAVING SUM(a.minutes)>p.minutes',
  ];
  for (const setup of [SQL_BASE_SETUP, SQL_ALT_SETUP])
    for (const query of queries) {
      const result = evaluateSubmission(python, query, {
        setup,
        language: 'sql',
        checks: [{ label: 'Konsistente Tabellen', expression: 'result', expected: [] }],
      });
      expect(result.error).toBeUndefined();
      expect(result.checks.filter((c) => !c.passed)).toEqual([]);
    }
});
it('weist abweichende Manifest-Serialisierung und unvollständige Passvalidierung zurück', () => {
  const manifest = lessons.find((l) => l.id === 'de-manifest')!;
  const wrong = manifest.solution.replace(
    "json.dumps(records,sort_keys=True,ensure_ascii=False,separators=(',',':'))",
    'json.dumps(records,sort_keys=True)',
  );
  expect(wrong).not.toBe(manifest.solution);
  expect(evaluateSubmission(python, wrong, manifest).checks.some((c) => !c.passed)).toBe(true);
  const mart = lessons.find((l) => l.id === 'de-review')!;
  const invalid = mart.solution.replace(
    'valid=type(team) is int and team>0 and isinstance(detail,dict)',
    'valid=isinstance(detail,dict)',
  );
  expect(invalid).not.toBe(mart.solution);
  expect(evaluateSubmission(python, invalid, mart).checks.some((c) => !c.passed)).toBe(true);
});
