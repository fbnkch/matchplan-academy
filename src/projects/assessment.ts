import type { Lesson, ProjectDefinition } from '../types';

// Keep assessment corrections together so catalog assembly does not own grading rules.
export function composeProjectLesson(project: ProjectDefinition, prerequisites: string[]): Lesson {
  const checks = project.lesson.checks.map((check) => ({
    ...check,
    expression: check.expression
      .replaceAll('predictions >= 0', 'np.asarray(predictions) >= 0')
      .replaceAll('predictions <= 1', 'np.asarray(predictions) <= 1'),
  }));
  if (project.id === 'xg-modell')
    checks.push(
      {
        label: 'Festgelegte Merkmale',
        expression: 'features',
        expected: ['distance', 'angle'],
      },
      {
        label: '144 Trainingsschüsse',
        expression: 'len(train)',
        expected: 144,
      },
      {
        label: 'Vorhersagen stammen aus dem Modell',
        expression: 'bool(np.allclose(predictions, model.predict_proba(test[features])[:, 1]))',
        expected: true,
      },
      {
        label: 'Baseline-Brier korrekt berechnet',
        expression: 'bool(abs(baseline_brier - brier_score_loss(test["goal"], baseline)) < 1e-10)',
        expected: true,
      },
      {
        label: 'Modell nur auf Trainingsdaten angepasst',
        expression:
          '(lambda ref: bool(np.allclose(model.coef_, ref.coef_, rtol=1e-4, atol=1e-4) and np.allclose(model.intercept_, ref.intercept_, rtol=1e-4, atol=1e-4)))(__import__("sklearn.linear_model", fromlist=["LogisticRegression"]).LogisticRegression(max_iter=500, random_state=42).fit(train[features], train["goal"]))',
        expected: true,
      },
    );
  if (project.id === 'scouting-app')
    checks.push(
      {
        label: 'Score nach vereinbarten Gewichten',
        expression:
          'bool((peers["score"] - (.5 * peers["progressive_passes_z"] + .3 * peers["pressures_z"] - .2 * peers["turnovers_z"])).abs().max() < 1e-9)',
        expected: true,
      },
      {
        label: 'Sortierte Shortlist aus dem Score',
        expression: 'shortlist_names',
        expected: ['Pia', 'Nora', 'Fina'],
      },
      {
        label: 'Alternative Gewichtung ausgewertet',
        expression:
          'bool((peers["alternative"] - (.1 * peers["progressive_passes_z"] + .1 * peers["pressures_z"] - .8 * peers["turnovers_z"])).abs().max() < 1e-9)',
        expected: true,
      },
      {
        label: 'Alternative Namen aus der richtigen Rangfolge',
        expression: 'alternative_names',
        expected: ['Pia', 'Nora', 'Kira'],
      },
    );
  if (project.id === 'aktionswerte')
    checks.push(
      {
        label: 'Wertdifferenzen korrekt berechnet',
        expression:
          'bool((completed["delta"] - completed.apply(lambda r: zone_value(r["end_x"], r["end_y"]) - zone_value(r["start_x"], r["start_y"]), axis=1)).abs().max() < 1e-9)',
        expected: true,
      },
      {
        label: 'Negative Beiträge bleiben sichtbar',
        expression: 'bool(completed["delta"].lt(0).any())',
        expected: true,
      },
    );
  if (project.id === 'aktionswerte') {
    const grid = [
      [0.01, 0.02, 0.04, 0.08],
      [0.02, 0.04, 0.08, 0.16],
      [0.01, 0.02, 0.04, 0.08],
    ];
    grid.forEach((row, y) =>
      row.forEach((value, x) =>
        checks.push({
          label: `Rasterzelle ${y + 1}/${x + 1}`,
          expression: `zone_value(${15 + x * 30}, ${10 + y * (80 / 3)})`,
          expected: value,
        }),
      ),
    );
    checks.push({
      label: 'Außerhalb des Feldes wird erkannt',
      expression: 'zone_value(-1, 40)',
      expected: null,
      raises: 'ValueError',
    });
    checks.push({
      label: 'Rechte Feldgrenze geprüft',
      expression: 'zone_value(121, 40)',
      expected: null,
      raises: 'ValueError',
    });
    checks.push({
      label: 'Obere Feldgrenze geprüft',
      expression: 'zone_value(60, 100)',
      expected: null,
      raises: 'ValueError',
    });
    checks.push({
      label: 'Untere Feldgrenze geprüft',
      expression: 'zone_value(60, -1)',
      expected: null,
      raises: 'ValueError',
    });
  }
  const task =
    project.lesson.task.replace('mit +0,2, +0,6, −0,2', 'mit +0,1, +0,1, −0,8') +
    (project.id === 'xg-modell'
      ? ' Verwende die Variablennamen shots, train, test, features, model, predictions, baseline, model_brier und baseline_brier. Setze features auf ["distance", "angle"]. Die Prüfung vergleicht dein Ergebnis mit einer festen Referenz: LogisticRegression ohne Skalierung direkt auf train[features], mit Standardeinstellungen außer max_iter=500 und random_state=42. Passe das Modell ausschließlich mit train an. predictions darf ein Array oder eine Liste sein.'
      : project.id === 'aktionswerte'
        ? ' Wirf ValueError, wenn x außerhalb von 0 bis 120 oder y außerhalb von 0 bis 80 liegt.'
        : '');
  const solution =
    project.id === 'scouting-app'
      ? project.lesson.solution.replace(
          '.2 * peers["progressive_passes_z"] + .6 * peers["pressures_z"] - .2 * peers["turnovers_z"]',
          '.1 * peers["progressive_passes_z"] + .1 * peers["pressures_z"] - .8 * peers["turnovers_z"]',
        )
      : project.lesson.solution;

  return { ...project.lesson, task, solution, prerequisites, checks };
}
