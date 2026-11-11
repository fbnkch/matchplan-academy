import { createProjectDefinition } from '../../definition';
import analysisCsv from './data/events.csv?raw';
import starter from './starter.py?raw';
import solution from './solution.py?raw';

export const matchReportProject = createProjectDefinition({
  id: 'spielbericht',
  title: 'Spielbericht',
  subtitle: 'Abschlüsse auswerten und drei Befunde für den Trainerbericht formulieren',
  question: 'Wo entstehen Nordstadts Abschlüsse, und zeigt sich das Muster in mehreren Spielen?',
  prerequisites: ['analyse-spielbericht', 'analyse-video', 'de-review'],
  brief: [
    'Grenze ein, welche Frage zu den Abschlüssen du beantworten willst. Die vier fiktiven Spiele dienen dazu, den Ablauf zu prüfen. Aus den Ergebnissen kannst du keine Aussage über die Qualität einer echten Mannschaft ableiten.',
    'Prüfe zuerst Koordinaten, Angriffsrichtung und Ereignistypen. Das Feld reicht hier von 0 bis 120 in x- und von 0 bis 80 in y-Richtung. Auch gehaltene oder geblockte Shot-Ereignisse zählen als Schüsse. Die Pässe in der CSV helfen dir zu kontrollieren, ob der Schussfilter arbeitet.',
    'Erstelle eine Schusskarte, eine Verteilung nach Zonen und einen Vergleich der einzelnen Spiele. Formuliere daraus drei Befunde auf höchstens zwei Seiten für den Trainerstab. Zeige zu jedem Befund, wie du ihn gegengeprüft hast und welche Aussage die Daten offenlassen.',
    'Übertrage den fertigen Probelauf anschließend auf zwei bis vier passende Spiele aus StatsBomb Open Data. Lade Matchdaten, Events und Aufstellungen. Notiere Wettbewerb, Saison, Match-IDs, Abrufdatum und Nutzungsrechte, bevor du den Beispieldatensatz ersetzt.',
  ],
  milestones: [
    {
      id: 'question',
      title: 'Frage und Datenumfang festlegen',
      description:
        'Definiere Team, Spiele, Wettbewerb und genau eine Frage. Halte fest, welche Spiele oder Ereignisse fehlen.',
      deliverable:
        'Fragestellung und Datentabelle mit Quelle, Saison, Match-IDs und Koordinatenkonvention.',
      criteria: [
        'Ist die Frage mit Eventdaten beantwortbar?',
        'Sind echte und synthetische Daten deutlich getrennt?',
      ],
    },
    {
      id: 'audit',
      title: 'Ereignisse prüfen',
      description:
        'Prüfe fehlende Werte, Duplikate, Teamnamen, Wertebereiche und Richtung. Kontrolliere die Zahl der Shot-Ereignisse je Spiel.',
      deliverable:
        'Kleine Qualitätsprüfung mit mindestens drei Assertions und einer Kontrollzählung.',
      criteria: ['Zählen gehaltene Schüsse mit?', 'Wurden Pässe ausgeschlossen?'],
    },
    {
      id: 'charts',
      title: 'Drei Grafiken erstellen',
      description:
        'Zeichne Schusskarte, Zonenbalken und Spielvergleich mit Achsen, Einheiten, Legende und Datenhinweis.',
      deliverable: 'Drei exportierbare Grafiken und reproduzierbarer Analysecode.',
      criteria: [
        'Entspricht die Karte der dokumentierten Spielrichtung?',
        'Stimmen Grafikzahlen mit der Tabelle überein?',
      ],
    },
    {
      id: 'findings',
      title: 'Befunde und Gegenargumente',
      description:
        'Beschreibe drei Beobachtungen. Prüfe jeden Befund pro Spiel statt nur in der Gesamtsumme.',
      deliverable: 'Drei konkrete Befunde mit Bezug auf Daten und einem möglichen Gegenargument.',
      criteria: [
        'Wird aus wenigen Spielen kein stabiler Spielstil behauptet?',
        'Ist jede Zahl nachvollziehbar?',
      ],
    },
    {
      id: 'report',
      title: 'Trainerbericht abschließen',
      description:
        'Fasse die Frage, Grafiken, Befunde, Grenzen und einen sinnvollen nächsten Prüfschritt zusammen.',
      deliverable: 'BERICHT.md bzw. daraus ein Bericht von höchstens zwei Seiten.',
      criteria: [
        'Versteht ein Trainer die Aussage ohne Code?',
        'Stehen Grenzen neben der Empfehlung?',
      ],
    },
  ],
  rubric: [
    'Der Bericht nennt Quelle, Datenauswahl und die verwendeten Ereignisdefinitionen.',
    'Jede der drei Grafiken trägt zur Antwort auf die festgelegte Fußballfrage bei.',
    'Die Schlussfolgerungen beziehen sich auf die ausgewählten Spiele; weitergehende Vermutungen sind als solche erkennbar.',
    'Eine andere Person kann die Analyse starten und die Zählungen mit den dokumentierten Daten nachrechnen.',
  ],
  lesson: {
    id: 'projekt-spielbericht',
    title: 'Spielbericht berechnen',
    minutes: 90,
    concept: 'Eventdaten, Gruppierung und Visualisierung',
    trackId: 'analysis',
    packages: ['pandas', 'matplotlib'],
    task: 'Filtere Shot-Ereignisse in shots. Erstelle summary_rows als Liste [team, Anzahl Schüsse, Anzahl Tore], alphabetisch nach Team. Zeichne zusätzlich die drei beschriebenen Grafiken. Die Codeprüfung kontrolliert die Zählung; die fachliche Qualität prüfst du mit der Rubrik.',
    starter: starter,
    solution: solution,
    checks: [
      {
        label: 'Schüsse und Tore korrekt je Team',
        expression: 'summary_rows',
        expected: [
          ['Hafenstadt', 16, 2],
          ['Nordstadt', 16, 2],
        ],
      },
      {
        label: 'Nur Shot-Ereignisse',
        expression: 'bool(shots["type"].eq("Shot").all())',
        expected: true,
      },
    ],
    explanation: [
      'Grenze ein, welche Frage zu den Abschlüssen du beantworten willst. Die vier fiktiven Spiele dienen dazu, den Ablauf zu prüfen. Aus den Ergebnissen kannst du keine Aussage über die Qualität einer echten Mannschaft ableiten.',
      'Prüfe zuerst Koordinaten, Angriffsrichtung und Ereignistypen. Das Feld reicht hier von 0 bis 120 in x- und von 0 bis 80 in y-Richtung. Auch gehaltene oder geblockte Shot-Ereignisse zählen als Schüsse. Die Pässe in der CSV helfen dir zu kontrollieren, ob der Schussfilter arbeitet.',
    ],
    example:
      'shots = events.loc[events["type"].eq("Shot")].copy()\nsummary = shots.groupby("team").agg(shots=("type", "size"), goals=("goal", "sum")).reset_index().sort_values("team")\nsummary_rows = summary[["team", "shots", "goals"]].values.tolist()\nprint(summary.to_string(index=False))\nimport matplotlib.pyplot as plt',
    hints: [
      'Zähle vor dem Plotten die Ereignistypen und die Shot-Ereignisse je Team. Prüfe in den geladenen Daten, welche Spalte einen Treffer kennzeichnet.',
      'Lass dir die gefilterten Zeilen mit print anzeigen und rechne ein Team von Hand nach. Erst wenn diese Zählung stimmt, gruppierst du nach Team und Spiel. Die Kurslektionen zu Gruppierung und Koordinaten helfen bei der Umsetzung.',
      'Vergleiche an einem kleinen Ausschnitt deinen Filter mit dem Teilbeispiel. Arbeite danach die Meilensteine einzeln ab: Datenprüfung, Grafiken und schriftliche Befunde. So kannst du einen Fehler dem jeweiligen Schritt zuordnen.',
    ],
    reflection:
      'Wo entstehen Nordstadts Abschlüsse, und zeigt sich das Muster in mehreren Spielen?',
    rubric: [
      'Der Bericht nennt Quelle, Datenauswahl und die verwendeten Ereignisdefinitionen.',
      'Jede der drei Grafiken trägt zur Antwort auf die festgelegte Fußballfrage bei.',
      'Die Schlussfolgerungen beziehen sich auf die ausgewählten Spiele; weitergehende Vermutungen sind als solche erkennbar.',
      'Eine andere Person kann die Analyse starten und die Zählungen mit den dokumentierten Daten nachrechnen.',
    ],
    objective: 'Abschlüsse auswerten und drei Befunde für den Trainerbericht formulieren',
    sources: [
      {
        title: 'StatsBomb/Hudl Open Data – Daten und Nutzungsbedingungen',
        url: 'https://github.com/hudl/open-data',
      },
      {
        title: 'pandas User Guide',
        url: 'https://pandas.pydata.org/docs/user_guide/index.html',
      },
    ],
  },
  reportTemplate:
    '# Spielbericht\n\n## Frage und Datenauswahl\n[Team, Spiele, Quelle, Abrufdatum, Auswahlgründe]\n\n## Drei Befunde\n1. [Beobachtung, Zahl, Grafik, Gegenprüfung]\n2. [Beobachtung, Zahl, Grafik, Gegenprüfung]\n3. [Beobachtung, Zahl, Grafik, Gegenprüfung]\n\n## Was diese Daten nicht zeigen\n[Stichprobe, Definitionen, fehlende Informationen]\n\n## Nächster Prüfschritt\n[Konkrete Video- oder Datenprüfung]\n',
  limitations: [
    'Die 48 Beispielereignisse sind synthetisch und nicht vollständig wie ein echtes Spiel.',
    'Die Koordinaten sind bereits auf eine Angriffsrichtung vereinheitlicht. Echte Rohdaten müssen nach Anbieterdefinition geprüft werden.',
  ],
  analysisData: {
    fileName: 'data/events.csv',
    variableName: 'events',
    csv: analysisCsv,
  },
  transfer: {
    question: 'Übertrage deinen Bericht auf ein vollständiges, vorher nicht bearbeitetes Spiel.',
    tasks: [
      'Wähle ein öffentlich verfügbares Spiel und formuliere vor der Auswertung eine konkrete Fußballfrage.',
      'Baue Import, Datenvertrag und Abdeckungsbericht. Prüfe Koordinatenkonvention und fünf Eventsequenzen manuell.',
      'Erstelle höchstens drei begründete Grafiken. Trenne Beobachtung, Interpretation und die Frage an eine Videoanalyse.',
    ],
    evidence: [
      'Rohdatenquelle mit Revision/Hash und Abdeckung',
      'Ein Kommando für den vollständigen Bericht',
      'Kurzes Memo: Befund, Gegenargument und nächste Video-Prüfung',
    ],
  },
});
