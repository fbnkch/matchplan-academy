import type { ProjectDefinition } from './types';
export const projectDefinitions: ProjectDefinition[] = [
  {
    id: 'spielbericht',
    title: 'Spielbericht',
    subtitle: 'Abschlüsse auswerten und drei Befunde für den Trainerbericht formulieren',
    question: 'Wo entstehen Nordstadts Abschlüsse, und zeigt sich das Muster in mehreren Spielen?',
    prerequisites: ['schussfilter'],
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
      setup:
        'import pandas as pd\nfrom io import StringIO\nevents = pd.read_csv(StringIO("match_id,team,player,type,x,y,goal\\n1,Nordstadt,Ada,Pass,75,5,0\\n1,Hafenstadt,Mira,Shot,82,18,0\\n1,Nordstadt,Ada,Shot,89,31,0\\n1,Hafenstadt,Mira,Pass,96,44,0\\n1,Nordstadt,Ada,Shot,103,57,0\\n1,Hafenstadt,Mira,Shot,110,70,0\\n1,Nordstadt,Ada,Pass,77,13,0\\n1,Hafenstadt,Mira,Shot,84,26,1\\n1,Nordstadt,Ada,Shot,91,39,0\\n1,Hafenstadt,Mira,Pass,98,52,0\\n1,Nordstadt,Ada,Shot,105,65,0\\n1,Hafenstadt,Mira,Shot,112,8,0\\n2,Nordstadt,Ada,Pass,79,21,0\\n2,Hafenstadt,Mira,Shot,86,34,0\\n2,Nordstadt,Ada,Shot,93,47,1\\n2,Hafenstadt,Mira,Pass,100,60,0\\n2,Nordstadt,Ada,Shot,107,73,0\\n2,Hafenstadt,Mira,Shot,114,16,0\\n2,Nordstadt,Ada,Pass,81,29,0\\n2,Hafenstadt,Mira,Shot,88,42,0\\n2,Nordstadt,Ada,Shot,95,55,0\\n2,Hafenstadt,Mira,Pass,102,68,0\\n2,Nordstadt,Ada,Shot,109,11,0\\n2,Hafenstadt,Mira,Shot,76,24,0\\n3,Nordstadt,Ada,Pass,83,37,0\\n3,Hafenstadt,Mira,Shot,90,50,0\\n3,Nordstadt,Ada,Shot,97,63,0\\n3,Hafenstadt,Mira,Pass,104,6,0\\n3,Nordstadt,Ada,Shot,111,19,1\\n3,Hafenstadt,Mira,Shot,78,32,0\\n3,Nordstadt,Ada,Pass,85,45,0\\n3,Hafenstadt,Mira,Shot,92,58,0\\n3,Nordstadt,Ada,Shot,99,71,0\\n3,Hafenstadt,Mira,Pass,106,14,0\\n3,Nordstadt,Ada,Shot,113,27,0\\n3,Hafenstadt,Mira,Shot,80,40,1\\n4,Nordstadt,Ada,Pass,87,53,0\\n4,Hafenstadt,Mira,Shot,94,66,0\\n4,Nordstadt,Ada,Shot,101,9,0\\n4,Hafenstadt,Mira,Pass,108,22,0\\n4,Nordstadt,Ada,Shot,75,35,0\\n4,Hafenstadt,Mira,Shot,82,48,0\\n4,Nordstadt,Ada,Pass,89,61,0\\n4,Hafenstadt,Mira,Shot,96,74,0\\n4,Nordstadt,Ada,Shot,103,17,0\\n4,Hafenstadt,Mira,Pass,110,30,0\\n4,Nordstadt,Ada,Shot,77,43,0\\n4,Hafenstadt,Mira,Shot,84,56,0\\n"))',
      task: 'Filtere Shot-Ereignisse in shots. Erstelle summary_rows als Liste [team, Anzahl Schüsse, Anzahl Tore], alphabetisch nach Team. Zeichne zusätzlich die drei beschriebenen Grafiken. Die Codeprüfung kontrolliert die Zählung; die fachliche Qualität prüfst du mit der Rubrik.',
      starter:
        'shots = events.copy()\nsummary_rows = []\n# Filtern, pro Team zählen und drei Grafiken erstellen.\nprint(summary_rows)',
      solution:
        'shots = events.loc[events["type"].eq("Shot")].copy()\nsummary = shots.groupby("team").agg(shots=("type", "size"), goals=("goal", "sum")).reset_index().sort_values("team")\nsummary_rows = summary[["team", "shots", "goals"]].values.tolist()\nprint(summary.to_string(index=False))\nimport matplotlib.pyplot as plt\nfrom matplotlib.patches import Rectangle\nfig, ax = plt.subplots(figsize=(8, 5))\nax.add_patch(Rectangle((0, 0), 120, 80, fill=False, edgecolor="#465c70"))\nfor team, group in shots.groupby("team"):\n    ax.scatter(group["x"], group["y"], label=team, s=45, alpha=0.8)\nax.set(xlim=(0, 120), ylim=(0, 80), xlabel="x (0–120)", ylabel="y (0–80)", title="Synthetische Abschlüsse – Angriffsrichtung nach rechts")\nax.legend()\nshots.assign(zone=pd.cut(shots["y"], [0, 26.67, 53.33, 80], labels=["links", "mitte", "rechts"])).groupby(["team", "zone"], observed=False).size().unstack(fill_value=0).plot.bar(title="Abschlusszonen (synthetisch)", ylabel="Schüsse")\nshots.groupby(["match_id", "team"]).size().unstack(fill_value=0).plot.bar(title="Schüsse je Spiel (synthetisch)", ylabel="Schüsse")\n',
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
      prerequisites: ['schussfilter'],
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
    files: [
      {
        name: 'data/events.csv',
        content:
          'match_id,team,player,type,x,y,goal\n1,Nordstadt,Ada,Pass,75,5,0\n1,Hafenstadt,Mira,Shot,82,18,0\n1,Nordstadt,Ada,Shot,89,31,0\n1,Hafenstadt,Mira,Pass,96,44,0\n1,Nordstadt,Ada,Shot,103,57,0\n1,Hafenstadt,Mira,Shot,110,70,0\n1,Nordstadt,Ada,Pass,77,13,0\n1,Hafenstadt,Mira,Shot,84,26,1\n1,Nordstadt,Ada,Shot,91,39,0\n1,Hafenstadt,Mira,Pass,98,52,0\n1,Nordstadt,Ada,Shot,105,65,0\n1,Hafenstadt,Mira,Shot,112,8,0\n2,Nordstadt,Ada,Pass,79,21,0\n2,Hafenstadt,Mira,Shot,86,34,0\n2,Nordstadt,Ada,Shot,93,47,1\n2,Hafenstadt,Mira,Pass,100,60,0\n2,Nordstadt,Ada,Shot,107,73,0\n2,Hafenstadt,Mira,Shot,114,16,0\n2,Nordstadt,Ada,Pass,81,29,0\n2,Hafenstadt,Mira,Shot,88,42,0\n2,Nordstadt,Ada,Shot,95,55,0\n2,Hafenstadt,Mira,Pass,102,68,0\n2,Nordstadt,Ada,Shot,109,11,0\n2,Hafenstadt,Mira,Shot,76,24,0\n3,Nordstadt,Ada,Pass,83,37,0\n3,Hafenstadt,Mira,Shot,90,50,0\n3,Nordstadt,Ada,Shot,97,63,0\n3,Hafenstadt,Mira,Pass,104,6,0\n3,Nordstadt,Ada,Shot,111,19,1\n3,Hafenstadt,Mira,Shot,78,32,0\n3,Nordstadt,Ada,Pass,85,45,0\n3,Hafenstadt,Mira,Shot,92,58,0\n3,Nordstadt,Ada,Shot,99,71,0\n3,Hafenstadt,Mira,Pass,106,14,0\n3,Nordstadt,Ada,Shot,113,27,0\n3,Hafenstadt,Mira,Shot,80,40,1\n4,Nordstadt,Ada,Pass,87,53,0\n4,Hafenstadt,Mira,Shot,94,66,0\n4,Nordstadt,Ada,Shot,101,9,0\n4,Hafenstadt,Mira,Pass,108,22,0\n4,Nordstadt,Ada,Shot,75,35,0\n4,Hafenstadt,Mira,Shot,82,48,0\n4,Nordstadt,Ada,Pass,89,61,0\n4,Hafenstadt,Mira,Shot,96,74,0\n4,Nordstadt,Ada,Shot,103,17,0\n4,Hafenstadt,Mira,Pass,110,30,0\n4,Nordstadt,Ada,Shot,77,43,0\n4,Hafenstadt,Mira,Shot,84,56,0\n',
      },
    ],
    reportTemplate:
      '# Spielbericht\n\n## Frage und Datenauswahl\n[Team, Spiele, Quelle, Abrufdatum, Auswahlgründe]\n\n## Drei Befunde\n1. [Beobachtung, Zahl, Grafik, Gegenprüfung]\n2. [Beobachtung, Zahl, Grafik, Gegenprüfung]\n3. [Beobachtung, Zahl, Grafik, Gegenprüfung]\n\n## Was diese Daten nicht zeigen\n[Stichprobe, Definitionen, fehlende Informationen]\n\n## Nächster Prüfschritt\n[Konkrete Video- oder Datenprüfung]\n',
    limitations: [
      'Die 48 Beispielereignisse sind synthetisch und nicht vollständig wie ein echtes Spiel.',
      'Die Koordinaten sind bereits auf eine Angriffsrichtung vereinheitlicht. Echte Rohdaten müssen nach Anbieterdefinition geprüft werden.',
    ],
  },
  {
    id: 'xg-modell',
    title: 'Eigenes xG-Modell',
    subtitle: 'Torwahrscheinlichkeiten schätzen und an zurückgehaltenen Spielen prüfen',
    question:
      'Wie gut schätzt ein Modell aus Distanz und Winkel die Torwahrscheinlichkeit in Spielen, die es im Training nicht gesehen hat?',
    prerequisites: [],
    brief: [
      'Berechne zunächst Distanz und Torwinkel und verwende sie für eine logistische Regression. Das Feld misst hier 105 × 68 Meter, die Tormitte liegt bei (105, 34), das Tor ist 7,32 Meter breit. Prüfe diese Konvention vor der Berechnung: StatsBomb verwendet mit 120 × 80 eine andere Skala.',
      'Der Probelauf enthält 192 synthetische Schüsse aus 16 fiktiven Spielen. Ein einfacher Generator hat die Torlabels erzeugt. Damit kannst du die Verarbeitung und Bewertung durchspielen; eine gemessene Modellgüte gilt zunächst nur für diese erzeugten Daten.',
      'Verwende die Spiele 1 bis 12 zum Training und die Spiele 13 bis 16 zum Test. In dieser Aufgabe sind Distanz und Winkel die Modellmerkmale. Anbieter-xG bleibt für einen separaten Vergleich reserviert; Schussergebnis und erst nach dem Abschluss bekannte Angaben dürfen nicht in die Vorhersage eingehen.',
      'Vergleiche Brier-Score und Kalibration mit einer konstanten Vorhersage aus der Torquote des Trainingsbestands. Notiere auch Ansätze, die nicht funktioniert haben. Übertrage den Ablauf danach auf einen ausreichend großen realen Schussbestand und dokumentiere dessen Nutzungsrechte.',
    ],
    milestones: [
      {
        id: 'data',
        title: 'Schüsse und Merkmale definieren',
        description:
          'Dokumentiere Datenauswahl und Koordinatensystem. Rechne Distanz und Öffnungswinkel selbst aus.',
        deliverable:
          'Merkmalstabelle und Plausibilitätsbeispiele für zentralen und seitlichen Abschluss.',
        criteria: [
          'Sind Einheiten und Torposition korrekt?',
          'Enthalten Merkmale keine Information nach dem Schuss?',
        ],
      },
      {
        id: 'split',
        title: 'Testspiele festlegen',
        description:
          'Lege den Split vor der Modellbewertung fest. Kontrolliere, dass kein Spiel in beiden Teilmengen vorkommt.',
        deliverable: 'Train-/Test-IDs und Assertion zur Überschneidungsfreiheit.',
        criteria: ['Sind ganze Spiele getrennt?', 'Bleiben Testlabels außerhalb des Trainings?'],
      },
      {
        id: 'fit',
        title: 'Baseline und einfaches Modell',
        description:
          'Fit die logistische Regression nur auf Trainingsdaten. Speichere die Trainings-Torquote als konstante Baseline.',
        deliverable: 'Modell, Baseline und Testwahrscheinlichkeiten.',
        criteria: [
          'Liefern alle Vorhersagen Werte zwischen 0 und 1?',
          'Ist die Baseline unabhängig von den Testlabels?',
        ],
      },
      {
        id: 'evaluate',
        title: 'Wahrscheinlichkeiten bewerten',
        description:
          'Berechne Brier-Score und eine Kalibrierungstabelle mit Fallzahlen je Bin. Diskutiere Unsicherheit statt nur eine Kurve zu zeigen.',
        deliverable: 'Vergleichstabelle und Kalibrierungsgrafik.',
        criteria: [
          'Werden Testdaten nicht zur Modellwahl missbraucht?',
          'Stehen Stichprobengrößen bei der Kalibrierung?',
        ],
      },
      {
        id: 'model-card',
        title: 'Modellkarte schreiben',
        description:
          'Schreibe Zweck, Daten, Merkmale, Prüfung, Fehlversuche und Einsatzgrenzen auf. Nenne fehlende Merkmale wie Gegnerdruck oder Torwartposition.',
        deliverable: 'BERICHT.md als verständliche Modellkarte.',
        criteria: [
          'Wird 0,2 xG als Wahrscheinlichkeit und nicht als Torversprechen erklärt?',
          'Wird synthetische Güte nicht auf echte Vereine übertragen?',
        ],
      },
    ],
    rubric: [
      'Du kannst die berechnete Distanz und den Winkel an einzelnen Schüssen nachrechnen.',
      'Trainings- und Testlisten enthalten keine gemeinsamen Spiel-IDs.',
      'Der Bericht vergleicht Modell und Baseline und erklärt die Kalibration anhand der Fallzahlen.',
      'Anbieter-xG fließt nicht als Merkmal in dieses Modell ein; ein separater Vergleich ist gekennzeichnet.',
    ],
    lesson: {
      id: 'projekt-xg',
      title: 'xG-Pipeline ausführen',
      minutes: 120,
      concept: 'Modellierung und Bewertung auf Testspielen',
      trackId: 'statistics',
      packages: ['numpy', 'pandas', 'scikit-learn', 'matplotlib'],
      setup:
        'import pandas as pd\nfrom io import StringIO\nshots = pd.read_csv(StringIO("match_id,x,y,goal\\n1,74.589,14.23,0\\n1,73.457,28.032,1\\n1,81.997,15.686,0\\n1,102.796,50.954,0\\n1,89.396,51.35,0\\n1,68.449,16.73,0\\n1,100.133,52.695,0\\n1,71.86,36.404,0\\n1,100.839,49.432,0\\n1,96.517,32.412,1\\n1,65.853,35.79,0\\n1,97.123,42.684,0\\n2,87.255,43.427,0\\n2,92.307,57.534,0\\n2,68.721,19.197,0\\n2,69.826,46.901,0\\n2,95.576,28.692,1\\n2,75.338,10.916,0\\n2,77.691,52.378,0\\n2,72.323,51.822,0\\n2,77.794,25.088,0\\n2,102.239,14.943,0\\n2,95.618,30.782,0\\n2,76.653,15.692,0\\n3,69.46,21.689,0\\n3,91.517,33.553,1\\n3,73.637,43.326,0\\n3,96.044,43.464,0\\n3,80.262,17.352,0\\n3,85.513,41.28,0\\n3,81.187,45.858,0\\n3,66.731,13.708,0\\n3,102.192,48.386,0\\n3,79.691,23.592,0\\n3,96.957,53.861,0\\n3,77.009,35.442,0\\n4,80.347,10.597,0\\n4,78.934,32.771,0\\n4,87.553,43.635,0\\n4,87.935,21.129,0\\n4,80.896,54.928,0\\n4,99.991,55.597,0\\n4,100.144,11.217,0\\n4,85.56,34.106,0\\n4,102.237,43.966,0\\n4,76.735,37.074,0\\n4,66.888,26.284,0\\n4,94.121,56.672,1\\n5,86.876,24.555,0\\n5,90.382,32.453,1\\n5,92.402,34.291,1\\n5,97.09,45.108,0\\n5,93.067,35.772,0\\n5,102.346,39.808,0\\n5,67.074,36.093,0\\n5,74.482,45.867,1\\n5,100.739,31.507,1\\n5,86.861,37.4,1\\n5,80.485,38.3,1\\n5,70.34,15.181,0\\n6,75.733,36.907,0\\n6,102.043,42.092,0\\n6,78.732,43.62,0\\n6,99.789,52.343,0\\n6,89.903,45.928,0\\n6,75.545,17.063,0\\n6,68.924,26.434,0\\n6,94.578,40.917,0\\n6,76.083,43.245,0\\n6,78.459,45.067,0\\n6,93.638,42.854,0\\n6,95.506,56.106,0\\n7,98.476,17.773,0\\n7,84.624,43.486,1\\n7,81.621,12.518,0\\n7,73.647,28.555,0\\n7,90.483,39.049,1\\n7,83.989,37.435,0\\n7,70.505,17.368,0\\n7,101.774,46.82,1\\n7,73.507,47.717,0\\n7,98.199,51.159,1\\n7,90.828,54.664,0\\n7,86.891,52.758,0\\n8,93.762,31.379,0\\n8,74.051,33.984,0\\n8,74.144,17.477,0\\n8,70.279,48.091,0\\n8,73.619,21.055,0\\n8,95.98,57.054,0\\n8,81.488,15.926,0\\n8,96.959,22.393,0\\n8,87.522,27.497,0\\n8,76.233,21.124,0\\n8,93.999,12.392,0\\n8,71.987,24.746,0\\n9,100.006,48.617,0\\n9,66.878,47.65,0\\n9,98.961,11.963,0\\n9,68.476,45.319,0\\n9,74.837,51.274,0\\n9,67.317,49.416,0\\n9,74.059,45.378,0\\n9,79.76,57.116,0\\n9,81.823,34.667,0\\n9,72.454,12.971,0\\n9,90.121,57.687,0\\n9,79.598,52.157,0\\n10,75.313,54.593,0\\n10,90.167,41.104,0\\n10,78.138,19.911,0\\n10,85.84,14.315,1\\n10,91.927,51.811,0\\n10,94.256,31.615,0\\n10,69.829,16.926,0\\n10,84.435,23.084,0\\n10,66.532,11.762,0\\n10,78.503,32.644,0\\n10,96.543,28.834,0\\n10,98.217,22.522,0\\n11,71.016,34.906,0\\n11,83.022,22.781,0\\n11,80.779,47.074,0\\n11,86.352,49.605,0\\n11,79.87,52.912,0\\n11,73.541,36.239,0\\n11,102.101,26.509,1\\n11,91.865,48.264,0\\n11,86.129,41.963,0\\n11,95.768,29.307,1\\n11,98.725,50.754,0\\n11,76.147,39.337,0\\n12,70.686,12.411,0\\n12,72.519,48.367,0\\n12,89.575,43.981,1\\n12,66.855,36.695,0\\n12,97.524,26.055,0\\n12,102.738,23.696,0\\n12,73.073,54.468,0\\n12,77.1,23.791,0\\n12,94.888,24.264,0\\n12,79.085,13.316,1\\n12,98.448,35.126,1\\n12,99.344,28.878,0\\n13,69.933,30.223,0\\n13,72.24,53.15,0\\n13,102.856,26.259,0\\n13,68.898,13.153,0\\n13,69.877,52.524,0\\n13,89.573,29.711,0\\n13,67.079,25.814,0\\n13,81.438,18.068,1\\n13,86.192,37.381,0\\n13,67.354,51.601,0\\n13,102.085,44.362,0\\n13,94.438,22.067,0\\n14,69.861,36.693,0\\n14,91.14,32.046,1\\n14,88.245,38.062,0\\n14,99.931,24.991,1\\n14,83.242,51.224,0\\n14,88.511,38.74,0\\n14,94.466,48.863,0\\n14,93.502,26.41,0\\n14,91.549,28.136,0\\n14,71.793,51.219,0\\n14,78.044,29.189,0\\n14,85.917,56.124,0\\n15,84.512,24.135,0\\n15,79.951,34.052,0\\n15,73.5,40.356,0\\n15,71.305,43.082,0\\n15,88.214,29.478,0\\n15,80.278,46.06,0\\n15,74.188,37.976,0\\n15,65.279,40.98,0\\n15,92.669,16.087,0\\n15,100.057,21.844,0\\n15,73.959,53.596,0\\n15,69.926,44.779,0\\n16,82.138,17.018,0\\n16,69.851,25.86,0\\n16,99.656,57.819,0\\n16,98.053,36.388,0\\n16,98.748,56.553,0\\n16,85.56,15.279,0\\n16,74.727,50.16,0\\n16,94.606,45.781,1\\n16,89.423,50.132,0\\n16,95.926,31.909,0\\n16,85.731,20.887,0\\n16,96.664,25.773,0\\n"))',
      task: 'Berechne distance und angle, teile train/test nach match_id (1 bis 12 / 13 bis 16), fit eine logistische Regression und liefere predictions, model_brier, baseline_brier. Erstelle eine Kalibrierungsgrafik. Die synthetische Güte ist kein Beleg für echte Daten.',
      starter:
        'import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import brier_score_loss\n# 1. Merkmale berechnen\n# 2. Spiele trennen\n# 3. Modell und Baseline fitten\n# 4. Brier-Scores berechnen\npredictions = []',
      solution:
        'import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import brier_score_loss\nimport matplotlib.pyplot as plt\nshots = shots.copy()\ndx = 105 - shots["x"]\ndy = shots["y"] - 34\nshots["distance"] = np.hypot(dx, dy)\nshots["angle"] = np.arctan2(7.32 * dx, dx ** 2 + dy ** 2 - (7.32 / 2) ** 2)\ntrain = shots.loc[shots["match_id"] <= 12].copy()\ntest = shots.loc[shots["match_id"] > 12].copy()\nfeatures = ["distance", "angle"]\nmodel = LogisticRegression(max_iter=500, random_state=42)\nmodel.fit(train[features], train["goal"])\npredictions = model.predict_proba(test[features])[:, 1]\nbaseline = np.full(len(test), train["goal"].mean())\nmodel_brier = float(brier_score_loss(test["goal"], predictions))\nbaseline_brier = float(brier_score_loss(test["goal"], baseline))\nprint({"Testspiele": sorted(test["match_id"].unique().tolist()), "Modell-Brier": round(model_brier, 4), "Baseline-Brier": round(baseline_brier, 4)})\ncalibration = pd.DataFrame({"p": predictions, "goal": test["goal"].to_numpy()})\ncalibration["bin"] = pd.cut(calibration["p"], [0, .1, .2, .4, 1], include_lowest=True)\ncalibration.groupby("bin", observed=True).agg(predicted=("p", "mean"), observed=("goal", "mean")).plot(style="o-", ylim=(0, 1), title="Kalibrierung auf synthetischen Testdaten")\n',
      checks: [
        {
          label: 'Kein Spiel in Training und Test',
          expression: 'sorted(set(train["match_id"]) & set(test["match_id"]))',
          expected: [],
        },
        {
          label: '48 Testschüsse vorhergesagt',
          expression: 'len(predictions)',
          expected: 48,
        },
        {
          label: 'Wahrscheinlichkeiten gültig',
          expression: 'bool(np.all((predictions >= 0) & (predictions <= 1)))',
          expected: true,
        },
        {
          label: 'Brier korrekt berechnet',
          expression:
            'bool(abs(model_brier - brier_score_loss(test["goal"], predictions)) < 1e-10)',
          expected: true,
        },
        {
          label: 'Baseline nur aus Trainingsdaten',
          expression: 'bool(np.allclose(baseline, train["goal"].mean()))',
          expected: true,
        },
      ],
      explanation: [
        'Berechne zunächst Distanz und Torwinkel und verwende sie für eine logistische Regression. Das Feld misst hier 105 × 68 Meter, die Tormitte liegt bei (105, 34), das Tor ist 7,32 Meter breit. Prüfe diese Konvention vor der Berechnung: StatsBomb verwendet mit 120 × 80 eine andere Skala.',
        'Der Probelauf enthält 192 synthetische Schüsse aus 16 fiktiven Spielen. Ein einfacher Generator hat die Torlabels erzeugt. Damit kannst du die Verarbeitung und Bewertung durchspielen; eine gemessene Modellgüte gilt zunächst nur für diese erzeugten Daten.',
      ],
      example:
        'import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import brier_score_loss\nimport matplotlib.pyplot as plt\nshots = shots.copy()',
      hints: [
        'Prüfe an einem zentralen und einem seitlichen Schuss, ob Distanz und Torwinkel zur dokumentierten Feldgeometrie passen. Kontrolliere anschließend die Spiel-IDs beider Teilmengen.',
        'Berechne die Torquote nur aus train und verwende sie für jede Baseline-Vorhersage im Test. Die logistische Regression erhält ebenfalls nur Trainingsdaten zum Anpassen. Vergleiche die Zwischenwerte mit den Kursbeispielen und Quellen.',
        'Gehe vom Teilbeispiel aus und prüfe einen Meilenstein nach dem anderen. Kontrolliere vor der Bewertung, ob jede Testzeile genau eine Wahrscheinlichkeit erhält. Schreibe Fallzahlen an die Kalibrierungsgrafik, damit du kleine Gruppen erkennst.',
      ],
      reflection:
        'Wie gut schätzt ein Modell aus Distanz und Winkel die Torwahrscheinlichkeit in Spielen, die es im Training nicht gesehen hat?',
      rubric: [
        'Du kannst die berechnete Distanz und den Winkel an einzelnen Schüssen nachrechnen.',
        'Trainings- und Testlisten enthalten keine gemeinsamen Spiel-IDs.',
        'Der Bericht vergleicht Modell und Baseline und erklärt die Kalibration anhand der Fallzahlen.',
        'Anbieter-xG fließt nicht als Merkmal in dieses Modell ein; ein separater Vergleich ist gekennzeichnet.',
      ],
      objective: 'Torwahrscheinlichkeiten schätzen und an zurückgehaltenen Spielen prüfen',
      prerequisites: [],
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
    files: [
      {
        name: 'data/shots.csv',
        content:
          'match_id,x,y,goal\n1,74.589,14.23,0\n1,73.457,28.032,1\n1,81.997,15.686,0\n1,102.796,50.954,0\n1,89.396,51.35,0\n1,68.449,16.73,0\n1,100.133,52.695,0\n1,71.86,36.404,0\n1,100.839,49.432,0\n1,96.517,32.412,1\n1,65.853,35.79,0\n1,97.123,42.684,0\n2,87.255,43.427,0\n2,92.307,57.534,0\n2,68.721,19.197,0\n2,69.826,46.901,0\n2,95.576,28.692,1\n2,75.338,10.916,0\n2,77.691,52.378,0\n2,72.323,51.822,0\n2,77.794,25.088,0\n2,102.239,14.943,0\n2,95.618,30.782,0\n2,76.653,15.692,0\n3,69.46,21.689,0\n3,91.517,33.553,1\n3,73.637,43.326,0\n3,96.044,43.464,0\n3,80.262,17.352,0\n3,85.513,41.28,0\n3,81.187,45.858,0\n3,66.731,13.708,0\n3,102.192,48.386,0\n3,79.691,23.592,0\n3,96.957,53.861,0\n3,77.009,35.442,0\n4,80.347,10.597,0\n4,78.934,32.771,0\n4,87.553,43.635,0\n4,87.935,21.129,0\n4,80.896,54.928,0\n4,99.991,55.597,0\n4,100.144,11.217,0\n4,85.56,34.106,0\n4,102.237,43.966,0\n4,76.735,37.074,0\n4,66.888,26.284,0\n4,94.121,56.672,1\n5,86.876,24.555,0\n5,90.382,32.453,1\n5,92.402,34.291,1\n5,97.09,45.108,0\n5,93.067,35.772,0\n5,102.346,39.808,0\n5,67.074,36.093,0\n5,74.482,45.867,1\n5,100.739,31.507,1\n5,86.861,37.4,1\n5,80.485,38.3,1\n5,70.34,15.181,0\n6,75.733,36.907,0\n6,102.043,42.092,0\n6,78.732,43.62,0\n6,99.789,52.343,0\n6,89.903,45.928,0\n6,75.545,17.063,0\n6,68.924,26.434,0\n6,94.578,40.917,0\n6,76.083,43.245,0\n6,78.459,45.067,0\n6,93.638,42.854,0\n6,95.506,56.106,0\n7,98.476,17.773,0\n7,84.624,43.486,1\n7,81.621,12.518,0\n7,73.647,28.555,0\n7,90.483,39.049,1\n7,83.989,37.435,0\n7,70.505,17.368,0\n7,101.774,46.82,1\n7,73.507,47.717,0\n7,98.199,51.159,1\n7,90.828,54.664,0\n7,86.891,52.758,0\n8,93.762,31.379,0\n8,74.051,33.984,0\n8,74.144,17.477,0\n8,70.279,48.091,0\n8,73.619,21.055,0\n8,95.98,57.054,0\n8,81.488,15.926,0\n8,96.959,22.393,0\n8,87.522,27.497,0\n8,76.233,21.124,0\n8,93.999,12.392,0\n8,71.987,24.746,0\n9,100.006,48.617,0\n9,66.878,47.65,0\n9,98.961,11.963,0\n9,68.476,45.319,0\n9,74.837,51.274,0\n9,67.317,49.416,0\n9,74.059,45.378,0\n9,79.76,57.116,0\n9,81.823,34.667,0\n9,72.454,12.971,0\n9,90.121,57.687,0\n9,79.598,52.157,0\n10,75.313,54.593,0\n10,90.167,41.104,0\n10,78.138,19.911,0\n10,85.84,14.315,1\n10,91.927,51.811,0\n10,94.256,31.615,0\n10,69.829,16.926,0\n10,84.435,23.084,0\n10,66.532,11.762,0\n10,78.503,32.644,0\n10,96.543,28.834,0\n10,98.217,22.522,0\n11,71.016,34.906,0\n11,83.022,22.781,0\n11,80.779,47.074,0\n11,86.352,49.605,0\n11,79.87,52.912,0\n11,73.541,36.239,0\n11,102.101,26.509,1\n11,91.865,48.264,0\n11,86.129,41.963,0\n11,95.768,29.307,1\n11,98.725,50.754,0\n11,76.147,39.337,0\n12,70.686,12.411,0\n12,72.519,48.367,0\n12,89.575,43.981,1\n12,66.855,36.695,0\n12,97.524,26.055,0\n12,102.738,23.696,0\n12,73.073,54.468,0\n12,77.1,23.791,0\n12,94.888,24.264,0\n12,79.085,13.316,1\n12,98.448,35.126,1\n12,99.344,28.878,0\n13,69.933,30.223,0\n13,72.24,53.15,0\n13,102.856,26.259,0\n13,68.898,13.153,0\n13,69.877,52.524,0\n13,89.573,29.711,0\n13,67.079,25.814,0\n13,81.438,18.068,1\n13,86.192,37.381,0\n13,67.354,51.601,0\n13,102.085,44.362,0\n13,94.438,22.067,0\n14,69.861,36.693,0\n14,91.14,32.046,1\n14,88.245,38.062,0\n14,99.931,24.991,1\n14,83.242,51.224,0\n14,88.511,38.74,0\n14,94.466,48.863,0\n14,93.502,26.41,0\n14,91.549,28.136,0\n14,71.793,51.219,0\n14,78.044,29.189,0\n14,85.917,56.124,0\n15,84.512,24.135,0\n15,79.951,34.052,0\n15,73.5,40.356,0\n15,71.305,43.082,0\n15,88.214,29.478,0\n15,80.278,46.06,0\n15,74.188,37.976,0\n15,65.279,40.98,0\n15,92.669,16.087,0\n15,100.057,21.844,0\n15,73.959,53.596,0\n15,69.926,44.779,0\n16,82.138,17.018,0\n16,69.851,25.86,0\n16,99.656,57.819,0\n16,98.053,36.388,0\n16,98.748,56.553,0\n16,85.56,15.279,0\n16,74.727,50.16,0\n16,94.606,45.781,1\n16,89.423,50.132,0\n16,95.926,31.909,0\n16,85.731,20.887,0\n16,96.664,25.773,0\n',
      },
    ],
    reportTemplate:
      '# Modellkarte: Distanz und Winkel\n\n## Zweck und Daten\n[Synthetischer Probelauf oder echte Daten mit Quelle]\n\n## Merkmale und Annahmen\n[Koordinaten, Distanz, Winkel, ausgeschlossene Merkmale]\n\n## Train-/Test-Design\n[Spiel-IDs, Split-Regel, Leakage-Prüfung]\n\n## Ergebnis im Test\n[Baseline-Brier, Modell-Brier, Kalibrierung mit Fallzahlen]\n\n## Fehlversuche und Unsicherheit\n[Was wurde verworfen, warum, was ist unklar?]\n\n## Einsatzgrenzen\n[Was das Modell nicht beantworten kann]\n',
    limitations: [
      'Der Generator ist stark vereinfacht; das Modell kann daraus keine reale Chancenqualität lernen.',
      'Eine kleine Kalibrierungstabelle ist instabil. Für echte Bewertung braucht es deutlich mehr ungesehene Spiele und Schüsse.',
    ],
  },
  {
    id: 'scouting-app',
    title: 'Scouting-App',
    subtitle: 'Ein Rollenprofil in eine Liste für die nächste Sichtung übersetzen',
    question:
      'Welche Mittelfeldspielerinnen kommen für eine verbindende Rolle im Ballbesitz infrage, und wie stark hängt die Auswahl von deinen Annahmen ab?',
    prerequisites: [],
    brief: [
      'Beschreibe vor dem Blick auf die Rangliste, was die gesuchte Spielerin im Aufbau, im Raumverhalten und gegen den Ball leisten soll. Wähle dafür vier bis sechs Kennzahlen. Halte fest, welche Anforderung jede Kennzahl abbildet und welche Information ihr fehlt.',
      'Die Demo enthält 24 synthetische Profile. Für den Vergleich wählst du MF mit mindestens 900 Minuten aus. Dieses Positionslabel grenzt die Gruppe nur grob ein. Prüfe bei der Interpretation weiterhin Rolle und Teamkontext, auch wenn du alle Werte auf 90 Minuten umgerechnet hast.',
      'Berechne einen gewichteten Score aus den innerhalb der Vergleichsgruppe standardisierten Raten. Ändere mindestens einmal die Gewichtung und prüfe zwei Minutenfilter. Wenige Ballverluste können auch bedeuten, dass eine Spielerin selten riskante Aktionen versucht. Beurteile den Wert deshalb zusammen mit der Ballprogression.',
      'Im Browser prüfst du den Analysekern. Das ZIP enthält zusätzlich eine lokal startbare Streamlit-App. Dort kannst du Daten laden, Position, Minuten und Gewichte ändern, Profile ansehen und die Auswahl als CSV exportieren. Installiere die Pakete mit pip install -r requirements.txt und starte streamlit run app.py.',
    ],
    milestones: [
      {
        id: 'role',
        title: 'Rollenprofil vor der Rangliste',
        description:
          'Beschreibe die Aufgaben der gesuchten Rolle und übersetze sie in begründete Kennzahlen. Notiere bewusst fehlende Daten.',
        deliverable: 'Rollenprofil mit vier bis sechs Kriterien, Bedeutung und Grenzen.',
        criteria: [
          'Sind Kriterien vor dem Blick auf Namen festgelegt?',
          'Stehen riskante und sichere Spielweisen im Kontext?',
        ],
      },
      {
        id: 'peers',
        title: 'Faire Vergleichsgruppe',
        description:
          'Wähle vergleichbare Rollen und eine Mindestspielzeit. Prüfe Datenabdeckung und berechne Raten pro 90.',
        deliverable: 'Peer-Tabelle mit Minuten, Raten und Ausschlussgründen.',
        criteria: [
          'Wird nicht zwischen fremden Positionen gerankt?',
          'Ist der Minutenfilter begründet?',
        ],
      },
      {
        id: 'ranking',
        title: 'Score und Gegenprüfung',
        description:
          'Standardisiere innerhalb der Peer-Gruppe, nicht über alle Positionen. Dokumentiere Richtung und Gewicht jeder Kennzahl.',
        deliverable: 'Shortlist mit drei Kandidatinnen und offenem Rechenweg.',
        criteria: [
          'Führt eine konstante Kennzahl nicht zu Division durch null?',
          'Werden fehlende Werte nicht still als Nullqualität behandelt?',
        ],
      },
      {
        id: 'sensitivity',
        title: 'Stabilität untersuchen',
        description:
          'Variiere Gewichte und Mindestminuten. Untersuche, welche Namen stabil bleiben und warum sich andere verändern.',
        deliverable: 'Mindestens drei Szenarien und eine Gegenargument-Spalte pro Kandidatin.',
        criteria: [
          'Werden instabile Rangunterschiede sichtbar?',
          'Wird ein Score nicht als objektive Wahrheit dargestellt?',
        ],
      },
      {
        id: 'app',
        title: 'App und Kandidatenberichte',
        description:
          'Exportiere das Projekt und starte die enthaltene Streamlit-App. Prüfe Filter, leere Auswahl und CSV-Export. Schreibe einen One-Pager pro Kandidatin für die Videosichtung.',
        deliverable: 'Startbare App, README und drei begründete Kandidatenprofile.',
        criteria: [
          'Kann eine zweite Person die App starten?',
          'Sind Video-/Livefragen und Gründe gegen die Auswahl benannt?',
        ],
      },
    ],
    rubric: [
      'Du begründest die Kennzahlen mit den Aufgaben der gesuchten Rolle, bevor du die Namen vergleichst.',
      'Der Bericht erklärt den Einfluss von Spielzeit, Position, Teamkontext und Datenlücken auf die Auswahl.',
      'Du zeigst die Rangfolgen unter anderen Annahmen und erklärst, warum Kandidatinnen auf- oder abrücken.',
      'In der App lassen sich Rechenweg und Grenzen nachvollziehen; Filter und CSV-Export funktionieren.',
    ],
    lesson: {
      id: 'projekt-scouting',
      title: 'Shortlist berechnen',
      minutes: 150,
      concept: 'Peer-Vergleich und Sensitivität',
      trackId: 'scouting',
      packages: ['pandas', 'matplotlib'],
      setup:
        'import pandas as pd\nfrom io import StringIO\nplayers = pd.read_csv(StringIO("name,position,minutes,progressive_passes,pressures,turnovers\\nAda,DF,450,30,25,10\\nMira,FW,630,41,42,13\\nLea,MF,810,52,59,16\\nNora,MF,990,63,76,19\\nIda,DF,1170,74,93,22\\nLina,FW,1350,85,110,25\\nPia,MF,1530,96,127,28\\nRia,MF,450,107,144,31\\nSina,DF,630,118,31,34\\nJona,FW,810,39,48,37\\nEmi,MF,990,50,65,40\\nFina,MF,1170,61,82,43\\nAlva,DF,1350,72,99,11\\nDina,FW,1530,83,116,14\\nEdda,MF,450,94,133,17\\nGina,MF,630,105,150,20\\nHana,DF,810,116,37,23\\nIlva,FW,990,37,54,26\\nJara,MF,1170,48,71,29\\nKira,MF,1350,59,88,32\\nLena,DF,1530,70,105,35\\nMara,FW,450,81,122,38\\nNika,MF,630,92,139,41\\nOda,MF,810,103,26,44\\n"))',
      task: 'Filtere peers auf MF und mindestens 900 Minuten. Standardisiere progressive_passes, pressures und turnovers als pro-90-Raten innerhalb peers. Verwende Gewichte +0,5, +0,3, −0,2. Erstelle shortlist_names (Top 3) und alternative_names mit +0,2, +0,6, −0,2. Zeichne die Raten der Shortlist.',
      starter:
        'peers = players.copy()\nshortlist_names = []\nalternative_names = []\n# Rolle und Spielzeit filtern, Raten bilden, standardisieren und gewichten.',
      solution:
        'import matplotlib.pyplot as plt\npeers = players.loc[players["position"].eq("MF") & players["minutes"].ge(900)].copy()\nfor metric in ["progressive_passes", "pressures", "turnovers"]:\n    peers[metric + "_p90"] = peers[metric] / peers["minutes"] * 90\n    values = peers[metric + "_p90"]\n    spread = values.std(ddof=0)\n    peers[metric + "_z"] = (values - values.mean()) / spread if spread > 0 else 0.0\npeers["score"] = .5 * peers["progressive_passes_z"] + .3 * peers["pressures_z"] - .2 * peers["turnovers_z"]\nshortlist = peers.sort_values(["score", "name"], ascending=[False, True]).head(3)\nshortlist_names = shortlist["name"].tolist()\nprint(shortlist[["name", "minutes", "score"]].to_string(index=False))\npeers["alternative"] = .2 * peers["progressive_passes_z"] + .6 * peers["pressures_z"] - .2 * peers["turnovers_z"]\nalternative_names = peers.sort_values(["alternative", "name"], ascending=[False, True]).head(3)["name"].tolist()\nprint("Andere Gewichtung:", alternative_names)\nshortlist.set_index("name")[["progressive_passes_p90", "pressures_p90", "turnovers_p90"]].plot.bar(title="Shortlist – beschreibende Raten, synthetische Daten")\n',
      checks: [
        {
          label: 'Nur passende Peer-Rollen',
          expression: 'bool(peers["position"].eq("MF").all())',
          expected: true,
        },
        {
          label: 'Mindestspielzeit angewendet',
          expression: 'bool(peers["minutes"].ge(900).all())',
          expected: true,
        },
        {
          label: 'Sechs Vergleichsprofile',
          expression: 'len(peers)',
          expected: 6,
        },
        {
          label: 'Drei eindeutige Kandidatinnen',
          expression: 'len(set(shortlist_names))',
          expected: 3,
        },
        {
          label: 'Alternative Auswertung vorhanden',
          expression: 'len(alternative_names)',
          expected: 3,
        },
        {
          label: 'Alle Kandidatinnen aus der Peer-Gruppe',
          expression: 'bool(set(shortlist_names).issubset(set(peers["name"])))',
          expected: true,
        },
      ],
      explanation: [
        'Beschreibe vor dem Blick auf die Rangliste, was die gesuchte Spielerin im Aufbau, im Raumverhalten und gegen den Ball leisten soll. Wähle dafür vier bis sechs Kennzahlen. Halte fest, welche Anforderung jede Kennzahl abbildet und welche Information ihr fehlt.',
        'Die Demo enthält 24 synthetische Profile. Für den Vergleich wählst du MF mit mindestens 900 Minuten aus. Dieses Positionslabel grenzt die Gruppe nur grob ein. Prüfe bei der Interpretation weiterhin Rolle und Teamkontext, auch wenn du alle Werte auf 90 Minuten umgerechnet hast.',
      ],
      example:
        'import matplotlib.pyplot as plt\npeers = players.loc[players["position"].eq("MF") & players["minutes"].ge(900)].copy()\nfor metric in ["progressive_passes", "pressures", "turnovers"]:\n    peers[metric + "_p90"] = peers[metric] / peers["minutes"] * 90\n    values = peers[metric + "_p90"]',
      hints: [
        'Kontrolliere nach dem Filter die Positionen und die kleinste Spielzeit in peers. Rechne für eine Spielerin eine Rate pro 90 Minuten nach, bevor du die Gruppe standardisierst.',
        'Standardisiere nur innerhalb peers. Prüfe die Streuung jeder Kennzahl: Ist sie null, darf deine Rechnung nicht durch null teilen. Vergleiche mit den Kursbeispielen und lass dir die Zwischenwerte ausgeben.',
        'Prüfe am Teilbeispiel zuerst die Standardisierung und dann den Score. Arbeite die restlichen Meilensteine einzeln ab. Sortiere für jede Gewichtung neu und übernimm alternative_names aus dieser Rangfolge; eine berechnete Spalte allein zeigt noch keine alternative Auswahl.',
      ],
      reflection:
        'Welche Mittelfeldspielerinnen kommen für eine verbindende Rolle im Ballbesitz infrage, und wie stark hängt die Auswahl von deinen Annahmen ab?',
      rubric: [
        'Du begründest die Kennzahlen mit den Aufgaben der gesuchten Rolle, bevor du die Namen vergleichst.',
        'Der Bericht erklärt den Einfluss von Spielzeit, Position, Teamkontext und Datenlücken auf die Auswahl.',
        'Du zeigst die Rangfolgen unter anderen Annahmen und erklärst, warum Kandidatinnen auf- oder abrücken.',
        'In der App lassen sich Rechenweg und Grenzen nachvollziehen; Filter und CSV-Export funktionieren.',
      ],
      objective: 'Ein Rollenprofil in eine Liste für die nächste Sichtung übersetzen',
      prerequisites: [],
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
    files: [
      {
        name: 'data/players.csv',
        content:
          'name,position,minutes,progressive_passes,pressures,turnovers\nAda,DF,450,30,25,10\nMira,FW,630,41,42,13\nLea,MF,810,52,59,16\nNora,MF,990,63,76,19\nIda,DF,1170,74,93,22\nLina,FW,1350,85,110,25\nPia,MF,1530,96,127,28\nRia,MF,450,107,144,31\nSina,DF,630,118,31,34\nJona,FW,810,39,48,37\nEmi,MF,990,50,65,40\nFina,MF,1170,61,82,43\nAlva,DF,1350,72,99,11\nDina,FW,1530,83,116,14\nEdda,MF,450,94,133,17\nGina,MF,630,105,150,20\nHana,DF,810,116,37,23\nIlva,FW,990,37,54,26\nJara,MF,1170,48,71,29\nKira,MF,1350,59,88,32\nLena,DF,1530,70,105,35\nMara,FW,450,81,122,38\nNika,MF,630,92,139,41\nOda,MF,810,103,26,44\n',
      },
      {
        name: 'app.py',
        content:
          'from pathlib import Path\nimport pandas as pd\nimport streamlit as st\n\nst.set_page_config(page_title="Matchplan – Scouting", layout="wide")\nst.title("Rollenprofil: verbindendes Mittelfeld")\nst.caption("Synthetische Übungsdaten. Diese Rangliste ersetzt keine Video- oder Liveprüfung.")\nplayers = pd.read_csv(Path(__file__).parent / "data" / "players.csv")\nminutes = st.sidebar.slider("Mindestspielzeit", 0, 1800, 900, 90)\nposition = st.sidebar.selectbox("Position", sorted(players["position"].unique().tolist()), index=2)\npassing = st.sidebar.slider("Gewicht progressive Pässe", 0.0, 1.0, 0.5, 0.1)\npressure = st.sidebar.slider("Gewicht Druckaktionen", 0.0, 1.0, 0.3, 0.1)\nlosses = st.sidebar.slider("Abzug Ballverluste", 0.0, 1.0, 0.2, 0.1)\npeers = players.loc[(players.position == position) & (players.minutes >= minutes)].copy()\nif len(peers) < 2:\n    st.info("Für einen Vergleich werden mindestens zwei Profile benötigt. Senke die Mindestspielzeit.")\n    st.stop()\nfor metric in ["progressive_passes", "pressures", "turnovers"]:\n    rate = peers[metric] / peers.minutes.replace(0, float("nan")) * 90\n    spread = rate.std(ddof=0)\n    peers[metric + "_p90"] = rate\n    peers[metric + "_z"] = (rate - rate.mean()) / spread if spread > 0 else 0.0\npeers["score"] = passing * peers.progressive_passes_z + pressure * peers.pressures_z - losses * peers.turnovers_z\nranked = peers.sort_values(["score", "name"], ascending=[False, True])\nst.dataframe(ranked, hide_index=True)\nselected = st.selectbox("Profil ansehen", ranked.name.tolist())\nprofile = ranked.loc[ranked.name == selected].iloc[0]\nst.subheader(selected)\nst.write("Spielzeit:", int(profile.minutes), "Minuten")\nst.bar_chart(pd.Series({metric: profile[metric + "_p90"] for metric in ["progressive_passes", "pressures", "turnovers"]}, name="pro 90"))\nst.download_button("Shortlist als CSV", ranked.to_csv(index=False), "shortlist.csv", "text/csv")\nst.markdown("### Vor einer Empfehlung prüfen")\nst.write("Rolle und Spielstil, Datenabdeckung, Ballbesitzkontext, Video, Verletzungskontext und Gründe gegen die Auswahl.")\n',
      },
      {
        name: 'requirements.txt',
        content: 'pandas==3.0.2\nmatplotlib==3.10.8\nstreamlit>=1.40,<2\n',
      },
    ],
    reportTemplate:
      '# Scouting-Auftrag: verbindendes Mittelfeld\n\n## Rolle und Kriterien\n[Aufgaben, Kennzahlen, Gewichtung vor der Analyse]\n\n## Vergleichsgruppe und Datenqualität\n[Positionen, Minuten, Ballbesitzkontext, Quelle]\n\n## Shortlist und Gegenargumente\n### Kandidatin 1\n[Eignung, Gegenargument, Videoauftrag]\n### Kandidatin 2\n[Eignung, Gegenargument, Videoauftrag]\n### Kandidatin 3\n[Eignung, Gegenargument, Videoauftrag]\n\n## Sensitivität\n[Welche Namen ändern sich bei anderen Gewichten oder Minutenfiltern?]\n\n## Empfehlung für die nächste Prüfung\n[Konkreter Arbeitsauftrag, kein automatischer Transferentscheid]\n',
    limitations: [
      'Positionslabels und drei Übungskennzahlen bilden keine vollständige Rolle ab.',
      'Die Demo kennt weder Transferbudget, Verletzungskontext noch Vertragsdaten. Empfehlungen bleiben Arbeitsaufträge zur weiteren Prüfung.',
    ],
  },
  {
    id: 'aktionswerte',
    title: 'Aktionswerte & Vereinspraxis',
    subtitle: 'Zonenwerte berechnen und die Rangfolge unter anderen Annahmen prüfen',
    question:
      'Welche erfolgreichen Ballaktionen erhöhen den vorgegebenen Zonenwert, und wie ändert sich das Ergebnis bei anderen Spielen oder Modellannahmen?',
    prerequisites: [],
    brief: [
      'Formuliere einen Vereinsauftrag, etwa zu progressiven Aktionen im Aufbau. Für den Probelauf stehen ein 4 × 3-Raster mit vorgegebenen synthetischen Zonenwerten und 36 fiktive Aktionen bereit.',
      'Berechne für erfolgreiche Aktionen den Endwert minus den Startwert. Damit untersuchst du das Rechenprinzip von xT. Die Rasterwerte sind vorgegeben; in dieser Aufgabe lernst du kein Expected-Threat-Modell aus realen Übergängen.',
      'Prüfe Koordinaten und Spielrichtung. Zeige auch negative Beiträge und vergleiche die Ergebnisse einzelner Spiele. Stelle neben den Summenwert eine einfache Aktionsanzahl: Wer länger spielt oder häufiger am Ball ist, hat mehr Gelegenheiten, Wert zu sammeln.',
      'Kläre bei einer Vereinsarbeit mit dem Trainerstab die Frage, Datenrechte, erwartete Entscheidung und das Berichtsformat. Gib einen einseitigen Bericht ab und dokumentiere Feedback samt Überarbeitung. Ohne Trainerkontakt bearbeitest du denselben Ablauf als Probelauf und hältst fest, dass die externe Prüfung noch fehlt.',
    ],
    milestones: [
      {
        id: 'brief',
        title: 'Vereinsauftrag und Hypothese',
        description:
          'Grenze die Frage ein und beschreibe, welche Entscheidung mit der Auswertung vorbereitet werden soll.',
        deliverable: 'Einseitiges Briefing mit Ansprechpartner oder deutlich benanntem Dry Run.',
        criteria: [
          'Ist eine sportliche Entscheidung benannt?',
          'Sind Datenrechte und Umfang geklärt?',
        ],
      },
      {
        id: 'pipeline',
        title: 'Reproduzierbare Pipeline',
        description:
          'Validiere Koordinaten, Ergebnisstatus und Spielrichtung. Trenne Laden, Aufbereitung, Bewertung und Bericht.',
        deliverable:
          'Startbarer Code mit Datenqualitätsprüfungen und dokumentierter Rasterkonvention.',
        criteria: [
          'Ist x=120 bzw. y=80 am Rand gültig?',
          'Werden fehlgeschlagene Aktionen bewusst behandelt?',
        ],
      },
      {
        id: 'value',
        title: 'Aktionen bewerten',
        description:
          'Berechne Endwert minus Startwert und aggregiere pro Spieler und Spiel. Zeige auch negative Beiträge.',
        deliverable: 'Aktionswerttabelle und Grafik mit Quelle und Methodengrenze.',
        criteria: [
          'Bleiben negative Werte erhalten?',
          'Wird das Spielzeugraster nicht als gelerntes xT verkauft?',
        ],
      },
      {
        id: 'robustness',
        title: 'Den Einfluss der Annahmen prüfen',
        description:
          'Prüfe die Rangfolge ohne ein einzelnes Spiel, mit anderen Rasterwerten und neben einer einfachen Passzählung.',
        deliverable:
          'Sensitivitätstabelle und mindestens zwei Gründe, die eine Empfehlung widerlegen könnten.',
        criteria: ['Wird Spielzeitkontext berücksichtigt?', 'Werden Methodenannahmen sichtbar?'],
      },
      {
        id: 'feedback',
        title: 'Bericht und externe Prüfung',
        description:
          'Schreibe einen knappen Bericht und einen konkreten nächsten Prüfschritt. Hole möglichst Trainerfeedback ein und überarbeite. Falls kein Feedback vorliegt, dokumentiere das statt es zu erfinden.',
        deliverable: 'BERICHT.md mit Feedbackprotokoll oder offen markiertem Dry Run.',
        criteria: [
          'Versteht ein Trainer den Befund?',
          'Wurde Feedback nachvollziehbar eingearbeitet oder sein Fehlen benannt?',
        ],
      },
    ],
    rubric: [
      'Die Verarbeitung prüft ihre Eingaben, und die einzelnen Berechnungsschritte lassen sich nachvollziehen.',
      'Der Bericht unterscheidet Aktionswert und Aktionsanzahl und berücksichtigt die Gelegenheiten durch Spielzeit und Ballbeteiligung.',
      'Du zeigst, wie sich das Ergebnis unter anderen Annahmen verändert und welche Unsicherheit bleibt.',
      'Aus dem Bericht geht hervor, welche konkrete Frage als Nächstes geprüft werden soll.',
    ],
    lesson: {
      id: 'projekt-aktionswerte',
      title: 'Aktionswerte berechnen',
      minutes: 120,
      concept: 'xT-Prinzip und robuste Auswertung',
      trackId: 'advanced',
      packages: ['pandas', 'matplotlib'],
      setup:
        'import pandas as pd\nfrom io import StringIO\nactions = pd.read_csv(StringIO("match_id,player,start_x,start_y,end_x,end_y,complete\\n1,Ada,10,5,30,6,0\\n1,Lea,17,16,43,23,1\\n1,Nora,24,27,56,40,1\\n1,Ada,31,38,69,57,1\\n1,Lea,38,49,82,6,1\\n1,Nora,45,60,95,23,0\\n1,Ada,52,6,108,40,1\\n1,Lea,59,17,32,57,1\\n1,Nora,66,28,45,6,1\\n1,Ada,73,39,58,23,1\\n1,Lea,10,50,71,40,0\\n1,Nora,17,61,84,57,1\\n2,Ada,24,7,97,6,1\\n2,Lea,31,18,110,23,1\\n2,Nora,38,29,34,40,1\\n2,Ada,45,40,47,57,0\\n2,Lea,52,51,60,6,1\\n2,Nora,59,62,73,23,1\\n2,Ada,66,8,86,40,1\\n2,Lea,73,19,99,57,1\\n2,Nora,10,30,112,6,0\\n2,Ada,17,41,36,23,1\\n2,Lea,24,52,49,40,1\\n2,Nora,31,63,62,57,1\\n3,Ada,38,9,75,6,1\\n3,Lea,45,20,88,23,0\\n3,Nora,52,31,101,40,1\\n3,Ada,59,42,114,57,1\\n3,Lea,66,53,38,6,1\\n3,Nora,73,64,51,23,1\\n3,Ada,10,10,64,40,0\\n3,Lea,17,21,77,57,1\\n3,Nora,24,32,90,6,1\\n3,Ada,31,43,103,23,1\\n3,Lea,38,54,116,40,1\\n3,Nora,45,65,40,57,0\\n"))',
      task: 'Schreibe zone_value(x, y) für das vorgegebene 4×3-Raster im Musterbeispiel (Feld 120×80). Berücksichtige gültige Randkoordinaten. Erzeuge completed mit erfolgreichen Aktionen und delta = Endwert − Startwert. Aggregiere ranking pro Spieler und zeichne das Ergebnis. Die automatische Prüfung kontrolliert die Raster- und Filterlogik, die fachliche Auslegung deine Rubrik.',
      starter:
        'grid = [[.01, .02, .04, .08], [.02, .04, .08, .16], [.01, .02, .04, .08]]\ndef zone_value(x, y):\n    return 0\n# Erfolgreiche Aktionen auswählen und bewerten.',
      solution:
        'import matplotlib.pyplot as plt\ngrid = [[.01, .02, .04, .08], [.02, .04, .08, .16], [.01, .02, .04, .08]]\ndef zone_value(x, y):\n    if not (0 <= x <= 120 and 0 <= y <= 80):\n        raise ValueError("Koordinate außerhalb des Spielfelds")\n    return grid[min(int(y / (80 / 3)), 2)][min(int(x / 30), 3)]\ncompleted = actions.loc[actions["complete"].eq(1)].copy()\ncompleted["delta"] = completed.apply(lambda r: zone_value(r["end_x"], r["end_y"]) - zone_value(r["start_x"], r["start_y"]), axis=1)\nranking = completed.groupby("player")["delta"].sum().sort_values(ascending=False)\nprint(ranking.to_string())\nper_match = completed.groupby(["match_id", "player"])["delta"].sum().unstack(fill_value=0)\nprint("Spielweise getrennt:", per_match.to_dict())\nranking.plot.bar(title="Aktionswert unter einem vorgegebenen Spielzeugraster", ylabel="Summe Endwert − Startwert")\n',
      checks: [
        {
          label: 'Linke untere Rasterzelle',
          expression: 'zone_value(0, 0)',
          expected: 0.01,
        },
        {
          label: 'Zentrale gefährliche Zone',
          expression: 'zone_value(105, 40)',
          expected: 0.16,
        },
        {
          label: 'Gültiger Feldrand',
          expression: 'zone_value(120, 80)',
          expected: 0.08,
        },
        {
          label: 'Nur erfolgreiche Aktionen',
          expression: 'bool(completed["complete"].eq(1).all())',
          expected: true,
        },
        {
          label: 'Erfolgreiche Aktionen vollständig',
          expression: 'len(completed)',
          expected: 28,
        },
        {
          label: 'Drei Spieler im Vergleich',
          expression: 'len(ranking)',
          expected: 3,
        },
      ],
      explanation: [
        'Formuliere einen Vereinsauftrag, etwa zu progressiven Aktionen im Aufbau. Für den Probelauf stehen ein 4 × 3-Raster mit vorgegebenen synthetischen Zonenwerten und 36 fiktive Aktionen bereit.',
        'Berechne für erfolgreiche Aktionen den Endwert minus den Startwert. Damit untersuchst du das Rechenprinzip von xT. Die Rasterwerte sind vorgegeben; in dieser Aufgabe lernst du kein Expected-Threat-Modell aus realen Übergängen.',
      ],
      example:
        'import matplotlib.pyplot as plt\ngrid = [[.01, .02, .04, .08], [.02, .04, .08, .16], [.01, .02, .04, .08]]\ndef zone_value(x, y):\n    if not (0 <= x <= 120 and 0 <= y <= 80):\n        raise ValueError("Koordinate außerhalb des Spielfelds")',
      hints: [
        'Ordne zunächst einige Koordinaten von Hand den Rasterzellen zu. Prüfe dabei auch x=120 und y=80. Kontrolliere in den geladenen Daten, welcher Ergebnisstatus eine erfolgreiche Aktion bezeichnet.',
        'Lass dir Startwert, Endwert und delta für einzelne Aktionen ausgeben. Ein Rückpass kann einen negativen Beitrag haben; entferne ihn deshalb nicht. Nutze die Kurslektionen und Quellen, um Filter und Rasterzuordnung gegenzuprüfen.',
        'Vergleiche deine Rasterfunktion an Randpunkten mit dem Teilbeispiel und arbeite danach die Meilensteine einzeln ab. Wenn die Einzelwerte stimmen, summierst du pro Spieler und vergleichst die Rangfolge zusätzlich pro Spiel und unter anderen Rasterwerten.',
      ],
      reflection:
        'Welche erfolgreichen Ballaktionen erhöhen den vorgegebenen Zonenwert, und wie ändert sich das Ergebnis bei anderen Spielen oder Modellannahmen?',
      rubric: [
        'Die Verarbeitung prüft ihre Eingaben, und die einzelnen Berechnungsschritte lassen sich nachvollziehen.',
        'Der Bericht unterscheidet Aktionswert und Aktionsanzahl und berücksichtigt die Gelegenheiten durch Spielzeit und Ballbeteiligung.',
        'Du zeigst, wie sich das Ergebnis unter anderen Annahmen verändert und welche Unsicherheit bleibt.',
        'Aus dem Bericht geht hervor, welche konkrete Frage als Nächstes geprüft werden soll.',
      ],
      objective: 'Zonenwerte berechnen und die Rangfolge unter anderen Annahmen prüfen',
      prerequisites: [],
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
    files: [
      {
        name: 'data/actions.csv',
        content:
          'match_id,player,start_x,start_y,end_x,end_y,complete\n1,Ada,10,5,30,6,0\n1,Lea,17,16,43,23,1\n1,Nora,24,27,56,40,1\n1,Ada,31,38,69,57,1\n1,Lea,38,49,82,6,1\n1,Nora,45,60,95,23,0\n1,Ada,52,6,108,40,1\n1,Lea,59,17,32,57,1\n1,Nora,66,28,45,6,1\n1,Ada,73,39,58,23,1\n1,Lea,10,50,71,40,0\n1,Nora,17,61,84,57,1\n2,Ada,24,7,97,6,1\n2,Lea,31,18,110,23,1\n2,Nora,38,29,34,40,1\n2,Ada,45,40,47,57,0\n2,Lea,52,51,60,6,1\n2,Nora,59,62,73,23,1\n2,Ada,66,8,86,40,1\n2,Lea,73,19,99,57,1\n2,Nora,10,30,112,6,0\n2,Ada,17,41,36,23,1\n2,Lea,24,52,49,40,1\n2,Nora,31,63,62,57,1\n3,Ada,38,9,75,6,1\n3,Lea,45,20,88,23,0\n3,Nora,52,31,101,40,1\n3,Ada,59,42,114,57,1\n3,Lea,66,53,38,6,1\n3,Nora,73,64,51,23,1\n3,Ada,10,10,64,40,0\n3,Lea,17,21,77,57,1\n3,Nora,24,32,90,6,1\n3,Ada,31,43,103,23,1\n3,Lea,38,54,116,40,1\n3,Nora,45,65,40,57,0\n',
      },
    ],
    reportTemplate:
      '# Aktionswerte: Projektbericht\n\n## Auftrag und erwartete Entscheidung\n[Trainerfrage oder als Dry Run gekennzeichnetes Briefing]\n\n## Daten und Methode\n[Quelle, Abdeckung, Raster, Koordinaten und Definitionen]\n\n## Ergebnis und einfache Baseline\n[Aktionswerte neben Aktionsanzahl und Spielzeit]\n\n## Robustheit und Gegenargumente\n[Andere Spiele, andere Rasterwerte, mögliche Widerlegung]\n\n## Empfehlung und nächster Prüfschritt\n[Konkrete Handlung mit Unsicherheit]\n\n## Feedback und Überarbeitung\n[Datum, Rückmeldung, Änderung oder offen benanntes fehlendes Feedback]\n',
    limitations: [
      'Die Rasterwerte sind vorgegeben und nicht aus realen Übergängen geschätzt.',
      'Die 36 Aktionen reichen für einen Probelauf, mit dem du Berechnung und Bericht übst. Für eine Spielerbewertung brauchst du mehr Beobachtungen aus passenden Spielsituationen.',
    ],
  },
];
