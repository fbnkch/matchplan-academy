import { createProjectDefinition } from '../../definition';
import analysisCsv from './data/actions.csv?raw';
import starter from './starter.py?raw';
import solution from './solution.py?raw';

export const actionValuesProject = createProjectDefinition({
  id: 'aktionswerte',
  title: 'Aktionswerte & Vereinspraxis',
  subtitle: 'Zonenwerte berechnen und die Rangfolge unter anderen Annahmen prüfen',
  question:
    'Welche erfolgreichen Ballaktionen erhöhen den vorgegebenen Zonenwert, und wie ändert sich das Ergebnis bei anderen Spielen oder Modellannahmen?',
  prerequisites: ['adv-capstone', 'adv-pipeline', 'de-review', 'ds-bootstrap'],
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
    task: 'Schreibe zone_value(x, y) für das vorgegebene 4×3-Raster im Musterbeispiel (Feld 120×80). Berücksichtige gültige Randkoordinaten. Erzeuge completed mit erfolgreichen Aktionen und delta = Endwert − Startwert. Aggregiere ranking pro Spieler und zeichne das Ergebnis. Die automatische Prüfung kontrolliert die Raster- und Filterlogik, die fachliche Auslegung deine Rubrik. Wirf ValueError, wenn x außerhalb von 0 bis 120 oder y außerhalb von 0 bis 80 liegt.',
    starter: starter,
    solution: solution,
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
      {
        label: 'Rasterzelle 1/1',
        expression: 'zone_value(15, 10)',
        expected: 0.01,
      },
      {
        label: 'Rasterzelle 1/2',
        expression: 'zone_value(45, 10)',
        expected: 0.02,
      },
      {
        label: 'Rasterzelle 1/3',
        expression: 'zone_value(75, 10)',
        expected: 0.04,
      },
      {
        label: 'Rasterzelle 1/4',
        expression: 'zone_value(105, 10)',
        expected: 0.08,
      },
      {
        label: 'Rasterzelle 2/1',
        expression: 'zone_value(15, 36.66666666666667)',
        expected: 0.02,
      },
      {
        label: 'Rasterzelle 2/2',
        expression: 'zone_value(45, 36.66666666666667)',
        expected: 0.04,
      },
      {
        label: 'Rasterzelle 2/3',
        expression: 'zone_value(75, 36.66666666666667)',
        expected: 0.08,
      },
      {
        label: 'Rasterzelle 2/4',
        expression: 'zone_value(105, 36.66666666666667)',
        expected: 0.16,
      },
      {
        label: 'Rasterzelle 3/1',
        expression: 'zone_value(15, 63.333333333333336)',
        expected: 0.01,
      },
      {
        label: 'Rasterzelle 3/2',
        expression: 'zone_value(45, 63.333333333333336)',
        expected: 0.02,
      },
      {
        label: 'Rasterzelle 3/3',
        expression: 'zone_value(75, 63.333333333333336)',
        expected: 0.04,
      },
      {
        label: 'Rasterzelle 3/4',
        expression: 'zone_value(105, 63.333333333333336)',
        expected: 0.08,
      },
      {
        label: 'Außerhalb des Feldes wird erkannt',
        expression: 'zone_value(-1, 40)',
        expected: null,
        raises: 'ValueError',
      },
      {
        label: 'Rechte Feldgrenze geprüft',
        expression: 'zone_value(121, 40)',
        expected: null,
        raises: 'ValueError',
      },
      {
        label: 'Obere Feldgrenze geprüft',
        expression: 'zone_value(60, 100)',
        expected: null,
        raises: 'ValueError',
      },
      {
        label: 'Untere Feldgrenze geprüft',
        expression: 'zone_value(60, -1)',
        expected: null,
        raises: 'ValueError',
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
    '# Aktionswerte: Projektbericht\n\n## Auftrag und erwartete Entscheidung\n[Trainerfrage oder als Dry Run gekennzeichnetes Briefing]\n\n## Daten und Methode\n[Quelle, Abdeckung, Raster, Koordinaten und Definitionen]\n\n## Ergebnis und einfache Baseline\n[Aktionswerte neben Aktionsanzahl und Spielzeit]\n\n## Robustheit und Gegenargumente\n[Andere Spiele, andere Rasterwerte, mögliche Widerlegung]\n\n## Empfehlung und nächster Prüfschritt\n[Konkrete Handlung mit Unsicherheit]\n\n## Feedback und Überarbeitung\n[Datum, Rückmeldung, Änderung oder offen benanntes fehlendes Feedback]\n',
  limitations: [
    'Die Rasterwerte sind vorgegeben und nicht aus realen Übergängen geschätzt.',
    'Die 36 Aktionen reichen für einen Probelauf, mit dem du Berechnung und Bericht übst. Für eine Spielerbewertung brauchst du mehr Beobachtungen aus passenden Spielsituationen.',
  ],
  analysisData: {
    fileName: 'data/actions.csv',
    variableName: 'actions',
    csv: analysisCsv,
  },
  transfer: {
    question: 'Prüfe ein Aktionswertmodell an vollständigen Sequenzen eines neuen Spiels.',
    tasks: [
      'Vergleiche die eigenen Zonenregeln mit SPADL/xT oder VAEP. Dokumentiere, welche Events verworfen, umgewandelt oder ergänzt werden.',
      'Prüfe Aktionsketten und Spielgrenzen. Fitte gelernte Werte nur auf dem Trainingsbestand, nicht auf dem später bewerteten Spiel.',
      'Untersuche die Stabilität von Team-/Spielerwerten unter anderen Gittern oder Modellannahmen. Vermeide kausale Zuschreibungen an einzelne Spieler.',
    ],
    evidence: [
      'Fünf von Hand geprüfte Sequenzen mit Roh- und Ergebniswerten',
      'Versioniertes Aktionsschema und Tests für Grenzfälle',
      'Einseitiger Vereinsbericht mit Robustheitsprüfung und Grenzen',
    ],
  },
});
