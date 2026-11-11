import { createProjectDefinition } from '../../definition';
import analysisCsv from './data/shots.csv?raw';
import starter from './starter.py?raw';
import solution from './solution.py?raw';

export const xgModelProject = createProjectDefinition({
  id: 'xg-modell',
  title: 'Eigenes xG-Modell',
  subtitle: 'Torwahrscheinlichkeiten schätzen und an zurückgehaltenen Spielen prüfen',
  question:
    'Wie gut schätzt ein Modell aus Distanz und Winkel die Torwahrscheinlichkeit in Spielen, die es im Training nicht gesehen hat?',
  prerequisites: ['stat-leakage', 'stat-kalibrierung', 'ds-review'],
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
    task: 'Berechne distance und angle, teile train/test nach match_id (1 bis 12 / 13 bis 16), fit eine logistische Regression und liefere predictions, model_brier, baseline_brier. Erstelle eine Kalibrierungsgrafik. Die synthetische Güte ist kein Beleg für echte Daten. Verwende die Variablennamen shots, train, test, features, model, predictions, baseline, model_brier und baseline_brier. Setze features auf ["distance", "angle"]. Die Prüfung vergleicht dein Ergebnis mit einer festen Referenz: LogisticRegression ohne Skalierung direkt auf train[features], mit Standardeinstellungen außer max_iter=500 und random_state=42. Passe das Modell ausschließlich mit train an. predictions darf ein Array oder eine Liste sein.',
    starter: starter,
    solution: solution,
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
        expression: 'bool(np.all((np.asarray(predictions) >= 0) & (np.asarray(predictions) <= 1)))',
        expected: true,
      },
      {
        label: 'Brier korrekt berechnet',
        expression: 'bool(abs(model_brier - brier_score_loss(test["goal"], predictions)) < 1e-10)',
        expected: true,
      },
      {
        label: 'Baseline nur aus Trainingsdaten',
        expression: 'bool(np.allclose(baseline, train["goal"].mean()))',
        expected: true,
      },
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
    '# Modellkarte: Distanz und Winkel\n\n## Zweck und Daten\n[Synthetischer Probelauf oder echte Daten mit Quelle]\n\n## Merkmale und Annahmen\n[Koordinaten, Distanz, Winkel, ausgeschlossene Merkmale]\n\n## Train-/Test-Design\n[Spiel-IDs, Split-Regel, Leakage-Prüfung]\n\n## Ergebnis im Test\n[Baseline-Brier, Modell-Brier, Kalibrierung mit Fallzahlen]\n\n## Fehlversuche und Unsicherheit\n[Was wurde verworfen, warum, was ist unklar?]\n\n## Einsatzgrenzen\n[Was das Modell nicht beantworten kann]\n',
  limitations: [
    'Der Generator ist stark vereinfacht; das Modell kann daraus keine reale Chancenqualität lernen.',
    'Eine kleine Kalibrierungstabelle ist instabil. Für echte Bewertung braucht es deutlich mehr ungesehene Spiele und Schüsse.',
  ],
  analysisData: {
    fileName: 'data/shots.csv',
    variableName: 'shots',
    csv: analysisCsv,
  },
  transfer: {
    question:
      'Trainiere auf einem größeren öffentlichen Schussbestand und prüfe eine zeitlich spätere Partieauswahl.',
    tasks: [
      'Definiere die Zielpopulation, zulässige Vor-Schuss-Merkmale und ausgeschlossene Informationen. Halte Spiel- und Datumsgrenzen ein.',
      'Fitte Preprocessing und Modell ausschließlich auf Trainingsdaten. Vergleiche Dummy-Baseline, logistische Regression und höchstens ein begründetes alternatives Modell.',
      'Berichte Brier, Logloss, Kalibration mit Binbesetzung und Match-Cluster-Unsicherheit. Untersuche Fehlergruppen; optimiere nicht auf dem finalen Testset.',
    ],
    evidence: [
      'Explizite Trainings-/Validierungs-/Test-Matchlisten',
      'Reproduzierbares Modell und unabhängige Referenzprüfung',
      'Model Card mit Datenlücken, erlaubtem Einsatz und klaren Nicht-Aussagen',
    ],
  },
});
