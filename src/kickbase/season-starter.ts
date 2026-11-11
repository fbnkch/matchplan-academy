import { strToU8, zipSync } from 'fflate';
import license from '../../LICENSE?raw';
import { seasonSteps } from './season-project';

// Deliberately enumerate learning sources. Local snapshots and credentials are never build input.
const learningFiles = import.meta.glob<string>(
  [
    '../../Beispielprojekte/Saison-Dashboard/src/season_dashboard/*.py',
    '../../Beispielprojekte/Saison-Dashboard/examples/*.py',
    '../../Beispielprojekte/Saison-Dashboard/coach.py',
    '../../Beispielprojekte/Saison-Dashboard/git_lab.py',
    '../../Beispielprojekte/Saison-Dashboard/README.md',
    '../../Beispielprojekte/Saison-Dashboard/pyproject.toml',
    '../../Beispielprojekte/Saison-Dashboard/.gitignore',
  ],
  { query: '?raw', import: 'default', eager: true },
);

export function exportSeasonStarter(): { data: Uint8Array; name: string } {
  const files: Record<string, Uint8Array> = {};
  for (const [sourcePath, content] of Object.entries(learningFiles)) {
    const relativePath = sourcePath.split('/Saison-Dashboard/')[1];
    if (!relativePath) continue;
    const isLearningModule = /^(?:src\/season_dashboard|examples)\/[a-z_]+\.py$/.test(relativePath);
    const isProjectFile = [
      'coach.py',
      'git_lab.py',
      'README.md',
      'pyproject.toml',
      '.gitignore',
    ].includes(relativePath);
    if (isLearningModule || isProjectFile)
      files[`Saison-Dashboard/${relativePath}`] = strToU8(content);
  }
  for (const requiredPath of [
    'coach.py',
    'git_lab.py',
    'README.md',
    'src/season_dashboard/client.py',
    'src/season_dashboard/auth.py',
    'src/season_dashboard/cleaning.py',
    'src/season_dashboard/identity.py',
    'src/season_dashboard/storage.py',
    'src/season_dashboard/metrics.py',
    'src/season_dashboard/dashboard.py',
    'examples/http_results.py',
    'examples/clean_inventory.py',
    'examples/sqlite_weather.py',
  ]) {
    if (!files[`Saison-Dashboard/${requiredPath}`])
      throw new Error(`Saisonprojekt unvollständig: ${requiredPath} fehlt.`);
  }
  files['Saison-Dashboard/LICENSE'] = strToU8(license);
  // Keep Vite's .env file protection intact; generate only an empty configuration template.
  files['Saison-Dashboard/.env.example'] = strToU8('KICKBASE_EMAIL=\nKICKBASE_PASSWORD=\n');
  const guide = [
    '# Arbeitsaufträge für dein Saison-Dashboard',
    'Arbeite in deiner IDE. Lies vor einem Abschnitt die passende Theorie auf der Website. Die Beispielprogramme sind Vorbilder; deinen Anwendungscode implementierst du selbst.',
    'Git parallel üben: python git_lab.py zeigt acht Arbeitsrunden. Lies die Git-Kapitel auf der Website und beginne mit --round 1. Nur --init NEUER_ORDNER legt auf deinen ausdrücklichen Aufruf ein separates Labor mit Startcommit an. Verwende dafür einen neuen Ordner außerhalb bestehender Repositories.',
    ...seasonSteps.map((step, index) =>
      [
        `## ${index + 1}. ${step.title}`,
        step.question,
        `Ziel: ${step.result}`,
        `Datei: ${step.folder}\n\nBefehl: \`${step.command}\``,
        ...(step.transfer
          ? [
              '### Vorhersage',
              step.transfer.prediction,
              ...step.transfer.references.map(
                (reference) =>
                  `### [${reference.title}](${reference.url})\n\nLesestelle: ${reference.section}\n\n${reference.observe}\n\nTransfer: ${reference.adapt}`,
              ),
              ...(step.transfer.localExample
                ? [`Lokales Vorbild: ${step.transfer.localExample}`]
                : []),
            ]
          : []),
        '### Dein Auftrag',
        ...step.assignment.map((task, taskIndex) => `${taskIndex + 1}. ${task}`),
        '### Wissen nachschlagen',
        ...step.concepts.map((concept) => `**${concept.title}**\n\n${concept.text}`),
        '### Ergebnis selbst prüfen',
        ...step.checks.map((check) => `- ${check}`),
        '<details>\n<summary>Denkanstöße erst nach dem eigenen Versuch öffnen</summary>\n',
        step.hint,
        ...(step.transfer?.hints.map((hint, hintIndex) => `${hintIndex + 1}. ${hint}`) ?? []),
        '</details>',
        '### Eigener Fehler, nächster Versuch',
        step.transfer?.feedback ?? '',
        '### Noch einmal ohne Vorlage',
        step.variant,
        step.recall,
      ].join('\n\n'),
    ),
  ].join('\n\n');
  files['Saison-Dashboard/LERNWEG.md'] = strToU8(guide);
  return { name: 'Saison-Dashboard.zip', data: zipSync(files) };
}
