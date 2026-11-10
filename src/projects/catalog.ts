import type { ProjectDefinition } from '../types';
import { projectDefinitions } from '../project-definitions';
import { projectPractice, localPortfolioGuide } from '../project-guidance';
import { composeProjectLesson } from './assessment';

const prerequisitesByProject: Record<string, string[]> = {
  spielbericht: ['analyse-spielbericht', 'analyse-video', 'de-review'],
  'xg-modell': ['stat-leakage', 'stat-kalibrierung', 'ds-review'],
  'scouting-app': ['scout-shortlist', 'scout-sensitivitaet', 'ds-sensitivity', 'de-joins'],
  aktionswerte: ['adv-capstone', 'adv-pipeline', 'de-review', 'ds-bootstrap'],
};

export const projects: ProjectDefinition[] = projectDefinitions.map(
  (project): ProjectDefinition => {
    const prerequisites = prerequisitesByProject[project.id];
    const files = project.files.map((file) =>
      file.name === 'app.py'
        ? {
            ...file,
            content: file.content.replace(
              'position = st.sidebar.selectbox("Position", sorted(players["position"].unique().tolist()), index=2)',
              'positions = sorted(players["position"].dropna().unique().tolist())\nif not positions:\n    st.info("Keine Positionsdaten vorhanden. Prüfe die CSV-Datei.")\n    st.stop()\nposition = st.sidebar.selectbox("Position", positions, index=positions.index("MF") if "MF" in positions else 0)',
            ),
          }
        : file,
    );
    const practiceGuidance = projectPractice[project.id];
    const milestones = [
      ...project.milestones,
      {
        id: 'real-data-transfer',
        title: 'Auf neue reale Daten übertragen',
        description: practiceGuidance.question,
        deliverable: practiceGuidance.evidence.join('; '),
        criteria: practiceGuidance.tasks,
      },
      {
        id: 'reproducible-delivery',
        title: 'Reproduzierbar ausliefern und erklären',
        description: 'Führe den lokalen Ablauf aus dem Export durch und dokumentiere die Prüfung.',
        deliverable: 'Startkommando, Fehlerprotokoll und fünfminütige fachliche Erklärung.',
        criteria: [
          'Frischer Datenstand ohne manuelle Anpassung.',
          'Datenquelle, Abdeckung, Tests und Grenzen dokumentiert.',
          'Eigene Entscheidungen ohne Musterlösung begründet.',
        ],
      },
    ];
    return {
      ...project,
      files: [
        ...files,
        {
          name: 'PRAXIS-TRANSFER.md',
          content:
            localPortfolioGuide +
            '\n## Dein Auftrag\n' +
            practiceGuidance.question +
            '\n\n' +
            practiceGuidance.tasks
              .map((step, stepIndex) => `${stepIndex + 1}. ${step}`)
              .join('\n') +
            '\n\n## Nachweise\n' +
            practiceGuidance.evidence.map((text) => '- ' + text).join('\n'),
        },
      ],
      milestones,
      prerequisites,
      lesson: composeProjectLesson(project, prerequisites),
    };
  },
);
