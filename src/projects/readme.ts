import type { ProjectDefinition } from '../types';

export function projectReadme(project: ProjectDefinition): string {
  const appInstructions = project.applicationInstructions ?? '';
  return `# ${project.title}

${project.subtitle}

## Auftrag
${project.question}

${project.brief.join('\n\n')}

## Starten

Verwende Python 3.14 oder eine kompatible aktuelle Version. Lege eine eigene virtuelle Umgebung an und installiere darin die Pakete:

\`\`\`sh
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python analyse.py
\`\`\`

analyse.py enthält deinen Arbeitsstand zum Zeitpunkt des Exports. Wenn du die Aufgabe noch nicht fertig bearbeitet hast, ist auch dieses Skript unvollständig. Mit reference_solution.py kannst du den Ablauf anhand der Referenzlösung nachvollziehen. Prüfe das Schema, bevor du die CSV unter data/ durch eigene Daten ersetzt, und kläre deren Nutzungsrechte.

${appInstructions}## Meilensteine
${project.milestones.map((milestone, milestoneIndex) => `${milestoneIndex + 1}. **${milestone.title}**\n   ${milestone.description}\n   Ergebnis: ${milestone.deliverable}\n   Prüfung: ${milestone.criteria.join(' / ')}`).join('\n\n')}

## Bewertungsrubrik
${project.rubric.map((criterion) => '- ' + criterion).join('\n')}

## Grenzen
${project.limitations.map((limitation) => '- ' + limitation).join('\n')}

## Reale Daten und Quellen

Die mitgelieferten Daten sind synthetisch. Reale Daten findest du beispielsweise unter https://github.com/hudl/open-data. Prüfe dort Wettbewerbe, Saisons und Match-IDs sowie die Definitionen der Events. Dokumentiere Quelle, Abrufdatum, Auswahl und Nutzungsbedingungen samt vorgeschriebener Quellenangabe. Kontrolliere die Spielabdeckung, bevor du Aussagen über eine ganze Liga machst.

Pandas: https://pandas.pydata.org/docs/
Matplotlib: https://matplotlib.org/stable/users/index.html
scikit-learn: https://scikit-learn.org/stable/

## Reproduzierbarkeit

analyse.py und reference_solution.py suchen die Daten ausgehend von ihrem eigenen Verzeichnis. Prüfe bei der lokalen Ausführung die Paketversionen, denn sie können sich von der WebAssembly-Umgebung unterscheiden. Ergebnisse auf synthetischen Daten beschreiben diesen Probelauf und belegen keine Modellgüte bei echten Vereinen. Halte deine Methodenentscheidungen in ANNAHMEN.md fest. Die Checkliste dokumentiert deine eigene Bearbeitung; eine fachliche Zertifizierung ist damit nicht verbunden.
`;
}
