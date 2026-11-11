import type { Lesson, ProjectDefinition } from '../types';
import portfolioGuide from './portfolio-guide.txt?raw';

interface ProjectTransfer {
  question: string;
  tasks: string[];
  evidence: string[];
}

interface ProjectSource extends Omit<ProjectDefinition, 'analysisData' | 'lesson' | 'files'> {
  analysisData: { fileName: string; variableName: string; csv: string };
  lesson: Omit<Lesson, 'setup' | 'prerequisites'>;
  transfer: ProjectTransfer;
  extraFiles?: ProjectDefinition['files'];
}

/** Builds the browser lesson and IDE files from the same project data and rules. */
export function createProjectDefinition(source: ProjectSource): ProjectDefinition {
  const { analysisData, lesson, transfer, extraFiles = [], ...project } = source;
  const { fileName, variableName, csv } = analysisData;

  return {
    ...project,
    analysisData: { fileName, variableName },
    lesson: {
      ...lesson,
      prerequisites: project.prerequisites,
      setup: `import pandas as pd\nfrom io import StringIO\n${variableName} = pd.read_csv(StringIO(${JSON.stringify(csv)}))`,
    },
    milestones: [
      ...project.milestones,
      {
        id: 'real-data-transfer',
        title: 'Auf neue reale Daten übertragen',
        description: transfer.question,
        deliverable: transfer.evidence.join('; '),
        criteria: transfer.tasks,
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
    ],
    files: [
      { name: fileName, content: csv },
      ...extraFiles,
      {
        name: 'PRAXIS-TRANSFER.md',
        content:
          portfolioGuide +
          '\n## Dein Auftrag\n' +
          transfer.question +
          '\n\n' +
          transfer.tasks.map((task, index) => `${index + 1}. ${task}`).join('\n') +
          '\n\n## Nachweise\n' +
          transfer.evidence.map((text) => '- ' + text).join('\n'),
      },
    ],
  };
}
